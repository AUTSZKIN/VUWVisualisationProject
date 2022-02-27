import * as d3 from "https://unpkg.com/d3@6.2.0?module"; // "bare" import d3-dag remotely using unpkg
import * as d3_dag from "/src/public/d3-dag/d3-dag-082.js"; // Starting from /src/, import local modified d3-dag library

export default function () {
  // const d3 = Object.assign({}, d3_basic, d3_dag); // Combine d3_base and d3_dag as one Library
  const highlightStyle = "stroke:red; stroke-width:4.5";
  const hoverHighlightStyle = "stroke:purple; stroke-width:3.5";
  const dotHoverHighlightStyle = "stroke:orange; stroke-width:4.5";
  const defaultUnhighlightedStyle = "stroke:grey; stroke-width:0.7";

  function sugiyama(dag) {
    const layering = d3_dag.layeringLongestPath();
    const decross = d3_dag.decrossTwoLayer();
    const coord = d3_dag.coordCenter(); //d3_dag.coordQuad();

    var xSep = 3700,
      ySep = 2500; // Controling Node Seperation/Position FIXME: Find a better way -> ALSO CHECK function sugiyama2() in d3-dag

    const sugiyamaOperator = d3_dag
      .sugiyama()
      .size([xSep, ySep]) //node sepration
      .layering(layering)
      .decross(decross)
      .coord(coord);

    sugiyamaOperator(dag);
    drawPaths(dag);
    drawNodes(dag);
    drawDotPath(dag);
    zoomPan();
    drawTooltipAndCourseInfoPanel();
    filterSearch();

    // Element stacking context will display in order of appearance, so manually move nodes to above dot pathss
    d3.select(".nodesContainer").raise();
  }

  return sugiyama;

  function drawPaths(dag) {
    // Draw edges
    const line = d3
      .line()
      .curve(d3.curveBundle.beta(0.2))
      .x((d) => d.x)
      .y((d) => d.y);

    // Plot edges
    d3.select("#mainSVG")
      .append("g")
      .attr("class", "pathContainer")
      .selectAll("path")
      .data(dag.links())
      .enter()
      .append("path")
      .attr("d", (data, i) => {
        return line(data.points); //return path line
      })
      .attr("fill", "none")
      .attr("style", defaultUnhighlightedStyle)
      .attr("class", (courseNode) => {
        return (
          "courseEdge " +
          courseNode.source.data.school +
          " " +
          courseNode.target.id
        ); // add connection as CLASS and target course as CLASS
      })
      .attr("id", (courseNode) => {
        const courseNodeId = courseNode.target.id;
        const prerequisiteNodeId = courseNode.source.id;
        return courseNode.source.id == "level100"
          ? "level100"
          : courseNodeId + "To" + prerequisiteNodeId;
      });
  }

  function drawDotPath(dag) {
    // Parse and save the collection of points between mainNode and its XOF node.
    var linesArray = new Array();

    d3.selectAll("line")
      .data(dag.links())
      .enter()
      .append("null")
      .attr("null", (courseData, i) => {
        parseXofCourses(courseData);
      })
      .remove();

    function parseXofCourses(data) {
      // Start Parsing
      const mainNodeId = data.target.id;
      const complexPrereqNode = data.target.data.parentIdsComplex;
      complexPrereqNode.length == 0
        ? null
        : (() => {
            complexPrereqNode.forEach(function (theOf) {
              const xOf = Object.keys(theOf)[0]; // The "XOf"
              Object.values(theOf).forEach(function (courseArr) {
                courseArr.forEach(function (course) {
                  // Course code regex
                  const courseCodeRegex = /^[A-Z]{4}[0-9]{3}/;
                  // If course is an actual course code (COMP101) but not the unspecifeid (COP3XX) add it to complexPrereqCourseArr
                  courseCodeRegex.test(course)
                    ? (() => {
                        // For each complex: Add a mainNode to ComplexCourseNode pair

                        // MAIN NODE's X and Y coordinates on SVG canvase
                        const mainNodeTranslate = getTranslateXYD3(
                          data.target.id
                        );
                        // XOF NODE's X and Y coordinates on SVG canvase
                        const complexNodeTranslate = getTranslateXYD3(course);

                        const pointsToComplexPrereq = {
                          x1: mainNodeTranslate.x,
                          y1: mainNodeTranslate.y,
                          x2: complexNodeTranslate.x,
                          y2: complexNodeTranslate.y,
                          id: mainNodeId + "To" + course + "DotEdge",
                          class: xOf + ":" + courseArr,
                        };
                        linesArray.push(pointsToComplexPrereq);
                      })()
                    : null;
                });
              });
            });
          })();

      function getTranslateXYD3(courseId) {
        // The translate string e.g. "translate(3594, 1388.8888)""
        const mainNodeTranslateString = d3
          .select("#" + courseId + "Node")
          .attr("transform");

        // Turn string into : "['3594', '1388.8888']"
        var matchesArray = mainNodeTranslateString.match(/\d+\.?\d+/g); // Note some value might not have decimal place hence "?" added
        return {
          x: matchesArray[0],
          y: matchesArray[1],
        };
      }
      // End Parsing
    }

    // Draw the actual dot edges using coordinates
    d3.select("#mainSVG")
      .append("g")
      .attr("class", "dotPathContainer")
      .selectAll("line")
      .data(linesArray)
      .enter()
      .append("line")
      .attr("stroke-dasharray", "10,10")
      .attr("fill", "none")
      .attr("style", defaultUnhighlightedStyle)
      .attr("class", "dotEdge")
      .attr("x1", (data, i) => {
        return data.x1;
      })
      .attr("y1", (data, i) => {
        return data.y1;
      })
      .attr("x2", (data, i) => {
        return data.x2;
      })
      .attr("y2", (data, i) => {
        return data.y2;
      })
      .attr("id", (data, i) => {
        return data.id;
      })
      .style("visibility", "hidden");
  }

  function drawNodes(dag) {
    var schoolList = [];

    // Draw nodes
    const courseNodes = d3
      .select("#mainSVG")
      .append("g")
      .attr("class", "nodesContainer")
      .selectAll("g")
      .data(dag.descendants())
      .enter()
      .append("g")
      .attr("transform", ({ x, y }) => `translate(${x}, ${y})`)
      .attr("class", (courseNode) => {
        return "courseNode " + courseNode.data.school; // Also assign the school as class
      })
      .attr("id", (courseNode) => {
        /** FIND DISTINCT SCHOOL*/
        schoolList.push(courseNode.data.school);

        return courseNode.data.id + "Node";
      });
    var schoolSet = [...new Set(schoolList)];
    console.log(schoolSet);

    // Draw node rectangle
    const nodeW = 95,
      nodeH = nodeW / 2;
    courseNodes
      .append("rect")
      .attr("width", nodeW)
      .attr("height", nodeH)
      .attr("x", "-" + nodeW / 2)
      .attr("y", "-" + nodeH / 2)
      .attr("rx", 6) //rounded corners
      .attr("ry", 6)
      .attr("fill", (courseNode) => {
        return courseNode.data.availability === "y" // If the course is available: blue node, otherwise grey.
          ? "rgb(81,157,213)"
          : "lightgrey";
      })
      .attr("style", defaultUnhighlightedStyle)
      .attr("class", "nodeRect")
      .attr("id", (courseNode) => courseNode.id + "Rect");

    // Add text to nodes
    courseNodes
      .append("text")
      .text((courseNode) => courseNode.id)
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "black")
      .attr("class", "nodeText")
      .attr("font-size", "115%")
      .attr("id", (courseNode) => courseNode.id + "Text");

    // Check is course contains complex prerequisites/requirement
    // If yes, add asterisk notation to the course code.
    // Return the course code
    courseNodes
      .append("text")
      .text((courseNode) => courseCodeProcessing(courseNode))
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .attr("fill", "darkslategray")
      .attr("class", "nodeText")
      .attr("font-size", "200%")
      .style("transform", "translate(35px, -14px)");

    function courseCodeProcessing(courseNode) {
      // console.log(courseNode);
      const parentIdsComplex = courseNode.data.parentIdsComplex;
      const specificPrereq = courseNode.data.specificPrereq;
      if (parentIdsComplex.length == 0 && specificPrereq == "") {
        return;
      }
      return "*";
    }

    // Hide level100 root node
    d3.selectAll(".level100Node *,#level100Node *")
      .attr("transform", "translate(-3000, -3000)")
      .style("display", "none");
  }

  function drawTooltipAndCourseInfoPanel() {
    const popUpWindow = d3
      .select("body")
      .append("div")
      .attr("class", "popUpWindow");

    /**
     * Actions on nodes
     */
    d3.selectAll(".courseNode") // replace the courseNodes
      .on("click", (e, courseNode) => {
        clickOnNode(courseNode);
      })
      .on("mouseover", (e, courseNode) => {
        mouseover(courseNode);
      })
      .on("mousemove", (e, courseNode) => mousemove(e, courseNode))
      .on("mouseout", (e, courseNode) => mouseleave(courseNode));

    function clickOnNode(courseNode) {
      // Highlight/Dehighlight clicked course node (Rect element)
      const courseNodeRectElem = d3
        .select("#" + courseNode.id + "Node")
        .select(".nodeRect");
      var isRectHighlighted = courseNodeRectElem.classed("highlighted");
      // TODO: Add IT BACK when unhighlight when highlight node is clicked
      // if (isRectHighlighted) {
      //   unclassifyHighlightedAndUnhighlightThem();
      // } else {
      classifyHighlightedAndHighlightThem(courseNode);
      classifyAndHighlightMultiChoicePrereq(courseNode);
      showCourseInfoPanel(courseNode);
      // }
    }

    function mouseover(courseNode) {
      popUpWindow
        .transition()
        .duration(100)
        .style("opacity", 0.95)
        .attr("visibility", "visible");
      d3.selectAll("#" + courseNode.id + "Rect").attr(
        "style",
        hoverHighlightStyle
      );
      highlightHoverOnCourse(courseNode);
      showXOfPrerequisite(courseNode);

      // Highlight without classify them as highlighted, just a temporarty highlight.
      function highlightHoverOnCourse(courseNode) {
        courseNode.data.parentIds.forEach((prerequisiteId) => {
          /**
           * RECURSIVELY HIGHLIGHT GRANDPARENTS NODE
           * TODO: CAN ADD A tickbox allow user to highlight only one level up or all the Ancestor Nodes
           */
          const parentNode = d3
            .selectAll(".courseNode")
            .filter("#" + prerequisiteId + "Node")._groups[0][0].__data__; //A HARDCORE WAY TO CONVERT prerequisiteId TO DAGNODE
          highlightHoverOnCourse(parentNode);
          //*******************************************************************************/
          const pathId = "#" + courseNode.id + "To" + prerequisiteId; // Path connect source and target node
          d3.selectAll(pathId).attr("style", hoverHighlightStyle); // highlight edge/path
          //highlight rect boarder
          d3.selectAll("#" + prerequisiteId + "Rect").attr(
            "style",
            hoverHighlightStyle
          );
        });
      }

      function showXOfPrerequisite(courseNode) {
        const complexPrereqCourseArr = getComplexPrereqCourseArr(courseNode);
        complexPrereqCourseArr.forEach((xOfPrerequisiteId) => {
          const pathId =
            "#" + courseNode.id + "To" + xOfPrerequisiteId + "DotEdge"; // Path connect source and target node
          d3.selectAll(pathId)
            .attr("style", dotHoverHighlightStyle)
            .style("visibility", "visible");
          d3.selectAll("#" + xOfPrerequisiteId + "Rect").attr(
            "style",
            dotHoverHighlightStyle
          );
        });
      }
    }

    function mousemove(mouseEvent, courseNode) {
      const popUpWindowWidth = popUpWindow.node().offsetWidth;
      const popUpWindowHeight = popUpWindow.node().offsetHeight;
      var x = mouseEvent.pageX - popUpWindowWidth - 6;
      var y = mouseEvent.pageY - popUpWindowHeight - 6;
      popUpWindow.style("left", x + "px").style("top", y + "px"); // set popUpWindow position on the top left.  TODO: remove "px"
      popUpWindow.html(
        `<p id="TooltipCourseName">${courseNode.data.id}: ${courseNode.data.courseTitle}</p>`
      );
    }

    function mouseleave(courseNode) {
      popUpWindow.transition().delay(200).style("opacity", 0);
      d3.selectAll("#" + courseNode.id + "Rect").attr(
        "style",
        defaultUnhighlightedStyle
      );
      deHighlightHoverOnCourse(courseNode);
      hideOfsPathAndNode(courseNode);

      function deHighlightHoverOnCourse(courseNode) {
        courseNode.data.parentIds.forEach((prerequisiteId) => {
          const parentNode = d3
            .selectAll(".courseNode")
            .filter("#" + prerequisiteId + "Node")._groups[0][0].__data__;
          deHighlightHoverOnCourse(parentNode);
          //*************************************************/
          const pathId = "#" + courseNode.id + "To" + prerequisiteId;
          d3.selectAll(pathId).attr("style", defaultUnhighlightedStyle);
          d3.selectAll("#" + prerequisiteId + "Rect").attr(
            "style",
            defaultUnhighlightedStyle
          );
        });
        //Keep highlighted course
        d3.selectAll(".highlighted").attr("style", highlightStyle);
      }

      function hideOfsPathAndNode(courseNode) {
        const complexPrereqCourseArr = getComplexPrereqCourseArr(courseNode);
        complexPrereqCourseArr.forEach((xOfPrerequisiteId) => {
          const pathId =
            "#" + courseNode.id + "To" + xOfPrerequisiteId + "DotEdge"; // Path connect source and target node
          d3.selectAll(pathId)
            .attr("style", defaultUnhighlightedStyle)
            .style("visibility", "hidden");
          d3.selectAll("#" + xOfPrerequisiteId + "Rect").attr(
            "style",
            defaultUnhighlightedStyle
          );
        });
        //Keep highlighted course
        highlightMultiChoicePrereq();
      }
    }

    function highlightMultiChoicePrereq() {
      d3.selectAll(".highlighted")
        .filter(".dotEdge")
        .style("visibility", "visible")
        .attr("style", dotHoverHighlightStyle);

      d3.selectAll(".highlighted")
        .filter(".highlightedDotRect")
        .style("visibility", "visible")
        .attr("style", dotHoverHighlightStyle);
    }

    function classifyHighlightedAndHighlightThem(courseNode) {
      // Add class "highlighted" to Highlight elements with id attached (Rect and Path)
      // Add Highlighted class to the highlighted node
      d3.selectAll("#" + courseNode.id + "Rect")
        .node()
        .classList.add("highlighted");

      // d3.selectAll("#" + courseNode.id + "Text")
      //   .node()
      //   .classList.add("highlighted");

      courseNode.data.parentIds.forEach((prerequisiteId) => {
        /**
         * RECURSIVELY ADD HIGHLIGHTED CLASS TO GRANDPARENTS NODE
         */
        const parentNode = d3
          .selectAll(".courseNode")
          .filter("#" + prerequisiteId + "Node")._groups[0][0].__data__; //A HARDCORE WAY TO CONVERT prerequisiteId TO DAGNODE
        classifyHighlightedAndHighlightThem(parentNode);
        //******************************************/
        const pathId = "#" + courseNode.id + "To" + prerequisiteId; // Path connect source and target node
        const thePath = d3.selectAll(pathId).node();
        // hightlight the path between course and each prereq node
        if (thePath !== null) {
          thePath.classList.add("highlighted");
        }
        // highlight the prereq node
        d3.selectAll("#" + prerequisiteId + "Rect")
          .node()
          .classList.add("highlighted");
      });

      // highlight elements when click exclude text
      $(".highlighted").attr("style", highlightStyle);
    }

    function classifyAndHighlightMultiChoicePrereq(courseNode) {
      const complexPrereqCourseArr = getComplexPrereqCourseArr(courseNode);

      complexPrereqCourseArr.forEach((prerequisiteId) => {
        const pathId = "#" + courseNode.id + "To" + prerequisiteId + "DotEdge"; // Path connect source and target node
        const thePath = d3.selectAll(pathId).node();
        // hightlight the path between course and each prereq node
        if (thePath !== null) {
          thePath.classList.add("highlighted");
        }
        // highlight the prereq node
        d3.selectAll("#" + prerequisiteId + "Rect")
          .node()
          .classList.add("highlighted");

        d3.selectAll("#" + prerequisiteId + "Rect")
          .node()
          .classList.add("highlightedDotRect");
      });

      highlightMultiChoicePrereq();
    }

    function getComplexPrereqCourseArr(courseNode) {
      // Get the ofs course into collection
      const complexPrereqCourseArr = new Array();
      const complexPrereqNode = courseNode.data.parentIdsComplex;
      complexPrereqNode.length == 0
        ? null
        : (() => {
            complexPrereqNode.forEach(function (theOf) {
              const xOf = Object.keys(theOf)[0]; // The "XOf"
              Object.values(theOf).forEach(function (courseArr) {
                courseArr.forEach(function (course) {
                  // Course code regex
                  const courseCodeRegex = /^[A-Z]{4}[0-9]{3}/;
                  // If course is an actual course code (COMP101) but not the unspecifeid (COP3XX) add it to complexPrereqCourseArr
                  courseCodeRegex.test(course)
                    ? (() => {
                        complexPrereqCourseArr.push(course);
                      })()
                    : null;
                });
              });
            });
          })();
      return complexPrereqCourseArr;
    }

    function showCourseInfoPanel(courseNode) {
      const courseId = courseNode.id;
      d3.select("#courseInfoHeader").text("Course Code: " + courseId);
      const cardBody = d3.select("#courseInfoCardBody");

      // 1. Handle prerequisites list and URL
      const prereq =
        courseNode.data.parentIds.length > 0 &&
        courseNode.data.parentIds[0] != "level100"
          ? getPrereqHerfElement()
          : "No prerequisite";

      function getPrereqHerfElement() {
        var prereqList = ``;
        courseNode.data.parentIds.forEach(function (parentCourse) {
          prereqList += `<a href="${directToCoursePage(
            parentCourse
          )}">${parentCourse}&ensp;</a>`; //add space: &ensp;
        });
        return prereqList;
      }
      //***************************/

      // 2. Specific Prereq, basically pure text
      const specificPrereq =
        courseNode.data.specificPrereq === ""
          ? "No other requirements"
          : courseNode.data.specificPrereq.replace(/['"]+/g, ""); // remove quotation mark from the specific requirenment

      // 3. Deal with the "ofs"
      const otherPrereq =
        courseNode.data.parentIdsComplex.length > 0
          ? `<label>Multi-choice prerequisites: </label>
          ${getOtherPrereqHerfElement()}
          `
          : `<label>Multi-choice prerequisites: </label> No multi-choice prerequisites <br>`;

      function getOtherPrereqHerfElement() {
        var otherPrereqList = ``;
        courseNode.data.parentIdsComplex.forEach(function (theOf) {
          otherPrereqList += `<li>${Object.keys(theOf)[0].replace(
            "of",
            " of"
          )}: `; // The "XOf", add space between number and 'of'
          Object.values(theOf).forEach(function (courseArr) {
            courseArr.forEach(function (course) {
              // Each course in the "Of"
              otherPrereqList += `<a href="${directToCoursePage(
                course //TODO:Deal with non course code
              )}">${course}&ensp;</a>`;
            });
            otherPrereqList += `</li>`;
          });
        });
        var otherPrereqListWithNotes =
          otherPrereqList +
          `<li style="font-weight:200; font-style:italic; font-size:90%;">(*For course with no spcified code, click them to view all the possible courses.)<li/>`;
        return otherPrereqList.includes("xx")
          ? otherPrereqListWithNotes
          : otherPrereqList;
      }
      //***************************/

      // 4. Actual Course detail body //
      cardBody.html(() => {
        return `
        <a href="${directToCoursePage(
          courseNode.id
        )}" style="font-size: larger;">${
          courseNode.data.courseTitle
        }</a> <text style="font-size: small;font-style:italic; "> &nbsp;&nbsp;</text>
        <hr style="width:90%;text-align:left;margin-left:0;height:0.5px;border-width:0;color:black;background-color:black;opacity:80%">
        <label>No choice prerequisites: </label>
        ${prereq}
        <br>
        ${otherPrereq}
        <label>Other requirements:  </label>
        <span style="font-style: normal; color:black;">${specificPrereq}</span>
        <br>
        <label>Trimester: </label>
        ${courseNode.data.trimester}<br>
        <label>School: </label>
        <a href="https://www.wgtn.ac.nz/${courseNode.data.school.toLowerCase()}">${
          courseNode.data.school
        }</a>
        
        <li style="font-weight:180; font-style:italic; font-size:90%;">*Please view the course outline page for more comprehensive details<li/>
        `; // TODO: add url
      });

      // OPTIONAL
      // 5. Set 2 panels at same highght level
      // var filterHeight = $("#filterCardContent").height();
      // var infoHeight = $("#courseInfoCardContent").height();
      // infoHeight > filterHeight
      //   ? (document.getElementById("filterCardContent").style.height =
      //       infoHeight + 10 + "px")
      //   : (document.getElementById("filterCardContent").style.height = "100%");
    }

    function directToCoursePage(courseNodeId) {
      // Here we have the course node element id
      var courseNodeIdRegex = /[a-zA-Z]+|[0-9]+/g;
      var displine = courseNodeId.match(courseNodeIdRegex)[0];
      var code = courseNodeId.match(courseNodeIdRegex)[1];
      const codeRegex = /^\d{3}$/;
      const courseOutlinePage =
        "https://www.wgtn.ac.nz/courses/" + displine + "/" + code;
      // If couse code is not valid, use VUW course finder.
      const VUWcourseFinder =
        "https://www.wgtn.ac.nz/search?q=" +
        displine +
        "&filterToggle=f.Course+level%7CcourseLevel=" +
        code.charAt(0) +
        "%20&tab=courses";
      return codeRegex.test(code) ? courseOutlinePage : VUWcourseFinder;
    }

    clearHighlightedOnClicked();

    function clearHighlightedOnClicked() {
      // Click outside of a node within the canvas to the hide highlighted elements
      d3.selectAll(".layerRect,.highlighted").on("click", () => {
        unclassifyHighlightedAndUnhighlightThem();
      });
    }
  }

  function unclassifyHighlightedAndUnhighlightThem() {
    d3.selectAll(".highlighted,.highlightedDotRect").attr(
      "style",
      defaultUnhighlightedStyle
    );
    d3.selectAll(".dotEdge")
      .attr("style", defaultUnhighlightedStyle)
      .style("visibility", "hidden");

    $(".highlighted").removeClass("highlighted");
    $(".highlightedDotRect").removeClass("highlightedDotRect");

    setDefaultCourseInfoBody();
    function setDefaultCourseInfoBody() {
      d3.select("#courseInfoHeader").html(`<h5>Course Info:<h5/>`);
      d3.select("#courseInfoCardBody").html(
        `<h4><i style="font-weight:250"> Click a course node to view more the course detail.<i/><h4/>`
      );
    }

    // Filter and Search involved
    $("g").children().css("opacity", "1"); // Reset all elements in mainSVG to unfaded state
  }

  function zoomPan() {
    const svgDivContainer = d3.select("#svgDivContainer");
    const mainSVG = d3.select("#mainSVG");

    /**
    0. SETTING THE BOUNDARY OF PANNING AREA
    1. Get coordinates, width and height of mainSVG element
    1.2 mainSVG.node() returns a SVGGraphicsElement
    1.3 and The SVGGraphicsElement.getBBox() allows us to determine the
    coordinates of the smallest rectangle in which the object fits. */
    const mainSVGGraphBox = mainSVG.node().getBBox();
    // 2. mainSVG top left as worldTopLeft
    const worldTopLeft = [mainSVGGraphBox.x, mainSVGGraphBox.y];
    // 3.mainSVG bottom right as the worldBottomRight
    const worldBottomRight = [
      mainSVGGraphBox.x + mainSVGGraphBox.width,
      mainSVGGraphBox.y + mainSVGGraphBox.height,
    ];

    // Actual zoom
    const zoom = d3
      .zoom()
      .scaleExtent([1, 4]) //SETTING ZOOMING RANGE LIMIT
      // 4. translateExtent([[x0, y0], [x1, y1]]), where [x0, y0] is the top-left corner of the world
      // and [x1, y1] is the bottom-right corner of the world
      .translateExtent([worldTopLeft, worldBottomRight])
      .on("zoom", (event) => {
        mainSVG
          .selectAll(function () {
            return this.childNodes; // select all the child nodes under mainSVG
          })
          .attr("transform", event.transform);
      });

    svgDivContainer.call(zoom);

    // Adding three Bootstrap style zoom buttons
    const zoomBtnContainer = d3
      .selectAll("#footnoteAndZoomContainer")
      .append("div")
      .attr("id", "zoomBtnContainer")
      .style("transform", "translate(0%, 2vw)")
      .html(
        '<button id="reset" class="btn btn-outline-primary btn-sm">Reset</button>' +
          '<button id="clear" class="btn btn-outline-primary btn-sm">Clear</button>' +
          '<button id="zoom_in" class="btn btn-outline-secondary btn-sm btn-circle">+</button>' +
          '<button id="zoom_out" class="btn btn-outline-secondary btn-sm btn-circle">-</button>'
      );

    // SETTING ZOOMING BUTTONS
    d3.select("#reset").on("click", reset);
    d3.select("#clear").on("click", unclassifyHighlightedAndUnhighlightThem);
    d3.select("#zoom_in").on("click", () =>
      svgDivContainer.transition().duration(500).call(zoom.scaleBy, 2)
    );
    d3.select("#zoom_out").on("click", () =>
      svgDivContainer.transition().duration(500).call(zoom.scaleBy, 0.5)
    );

    function reset() {
      svgDivContainer
        .transition()
        .duration(1000)
        .call(zoom.transform, d3.zoomIdentity); //Reset to original position
    }
  }

  function filterSearch() {
    // SCHOOL Filter
    const schoolPicker = d3.select(".selectpicker");
    schoolPicker.on("change", schoolUpdate);

    // Search Filter
    const searchButton = d3.select("#searchButton");
    searchButton.on("click", function () {
      let searchInput = document.querySelector("#searchInput"); //get user input as [object HTMLInputElement]
      searchUpdate(searchInput.value);
    });

    // SCHOOL UPDATE
    function schoolUpdate() {
      // Clean every courseEdge & courseNode highlight first
      unclassifyHighlightedAndUnhighlightThem();

      // Select the school code only (e.g. "SDI - School of Design Innovation")
      const schoolName = $(this).val();
      const schoolCode = schoolName.substr(0, schoolName.indexOf(" -"));
      // Select school other than 'All'
      if (schoolCode != "All") {
        // console.log(schoolCode);
        // Fade out unrelated nodes and path
        $(".courseNode:not(." + schoolCode + ")").css("opacity", "0.33");
        $(".courseEdge:not(." + schoolCode + ")").css("opacity", "0.33");
      } else {
        // if select 'All'
        $("g").children().css("opacity", "1"); // Reset all elements in mainSVG to unfaded state
      }
    }

    // SEARCH UPDATE
    function searchUpdate(keywords) {
      console.log("Searching String:" + keywords);
    }
  }
}
