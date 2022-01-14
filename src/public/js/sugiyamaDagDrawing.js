import * as d3 from "https://unpkg.com/d3@6.2.0?module"; // "bare" import d3-dag remotely using unpkg
import * as d3_dag from "/src/public/d3-dag/d3-dag-082.js"; // Starting from /src/, import local modified d3-dag library

export default function () {
  // const d3 = Object.assign({}, d3_basic, d3_dag); // Combine d3_base and d3_dag as one Library
  const highlightStyle = "stroke:red; stroke-width:4.5";
  const hoverHighlightStyle = "stroke:purple; stroke-width:3.5";
  const defaultUnhighlightedStyle = "stroke:grey; stroke-width:1";

  function sugiyama(dag) {
    const layering = d3_dag.layeringLongestPath();
    const decross = d3_dag.decrossTwoLayer();
    const coord = d3_dag.coordCenter();

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
    zoomPan();
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
      .selectAll("path")
      .data(dag.links())
      .enter()
      .append("path")
      .attr("d", (data, i) => {
        //TODO: Find away to generate value (of path) between each node and their parentIdsComplex node

        const mainNode = data.target;
        const prereqNode = data.source;
        const complexPrereqNode = data.target.data.parentIdsComplex;

        // console.log("mainNode");
        // console.log(mainNode);
        // console.log("prereqNode");
        // console.log(prereqNode);
        // complexPrereqNode.length == 0
        //   ? null
        //   : (() => {
        //       console.log("complexPrereqNode");
        //       complexPrereqNode.forEach(function (theOf) {
        //         const xOf = Object.keys(theOf)[0]; // The "XOf"
        //         const complexPrereqCourseArr = new Array();

        //         Object.values(theOf).forEach(function (courseArr) {
        //           courseArr.forEach(function (course) {
        //             // course = each course in the "Of"
        //             complexPrereqCourseArr.push(course);
        //             //TODO:Deal with non course code
        //           });
        //         });

        //         console.log(xOf, complexPrereqCourseArr);
        //       });
        //     })();

        return line(data.points); //return path line
      })
      .attr("fill", "none")
      .attr("style", defaultUnhighlightedStyle)
      .attr("transform", "translate(" + 10 + "," + 10 + ")")
      .attr("class", (courseNode) => {
        return (
          "courseEdge " +
          courseNode.source.data.school +
          " " +
          courseNode.target.id
        ); // add connection as CLASS and target course as CLASS
      })
      .attr("id", (courseNode) => {
        return courseNode.source.id == "level100"
          ? "level100"
          : courseNode.source.id + "To" + courseNode.target.id;
      });
  }

  function drawDotPath(dag) {
    const line = d3
      .line()
      // .curve(d3.curveBundle.beta(0.3))
      .x((d) => d.x)
      .y((d) => d.y);

    // Plot edges
    d3.select("#mainSVG")
      .selectAll("path")
      .data(dag.links())
      .enter()
      .append("path")
      .attr("d", (data, i) => {
        console.log(data);
        // console.log(line(data.points));
        return line(data.points); //return path line
      })
      .attr("stroke-dasharray", "5,5")
      .attr("fill", "none")
      .attr("style", defaultUnhighlightedStyle);
  }

  function drawNodes(dag) {
    // Draw nodes
    const courseNodes = d3
      .select("#mainSVG")
      .append("g") // A inner <g> container inside the mainSVG
      .selectAll("g")
      .data(dag.descendants())
      .enter()
      .append("g")
      .attr("transform", ({ x, y }) => `translate(${x}, ${y})`)
      .attr("class", (courseNode) => {
        return "courseNode " + courseNode.data.school; // Also assign the school as class
      })
      .attr("id", (courseNode) => {
        return courseNode.data.id + "Node";
      });

    //Draw tooltip and info panel
    drawTooltipAndCourseInfoPanel();

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
      .text((d) => d.id)
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "black")
      .attr("class", "nodeText")
      .attr("font-size", "115%")
      .attr("id", (courseNode) => courseNode.id + "Text");
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
      const node = d3.select("#" + courseNode.id + "Node");
      const rect = node.select(".nodeRect");
      var isRectHighlighted = rect.classed("highlighted");
      if (isRectHighlighted) {
        unclassifyHighlightedAndUnhighlightThem();
      } else {
        classifyHighlightedAndHighlightThem(courseNode);
        popUpWindow.style("visibility", "hidden"); // hide popup window
        showCourseInfo(courseNode);
      }
    }

    function mouseover(courseNode) {
      popUpWindow
        .transition()
        .duration(100)
        .style("opacity", 0.95)
        .style("visibility", "visible");
      highlightHoverOnCourse(courseNode);
      showOfsPath(courseNode);

      // Highlight without classify them as highlighted, just a temporarty highlight.
      function highlightHoverOnCourse(courseNode) {
        d3.selectAll("#" + courseNode.id + "Rect").attr(
          "style",
          hoverHighlightStyle
        );
        courseNode.data.parentIds.forEach((parentId) => {
          /**
           * RECURSIVELY HIGHLIGHT GRANDPARENTS NODE
           * TODO: CAN ADD A tickbox allow user to highlight only one level up or all the Ancestor Nodes
           */
          const parentNode = d3
            .selectAll(".courseNode")
            .filter("#" + parentId + "Node")._groups[0][0].__data__; //A HARDCORE WAY TO CONVERT parentID TO DAGNODE
          highlightHoverOnCourse(parentNode);
          //*******************************************************************************/
          // Path connect source and target node
          const pathId = "#" + parentId + "To" + courseNode.id;
          // highlight edge/path
          d3.selectAll(pathId).attr("style", hoverHighlightStyle);
          //highlight rect boarder
          d3.selectAll("#" + parentId + "Rect").attr(
            "style",
            hoverHighlightStyle
          );
        });
      }

      function showOfsPath(courseNode) {
        console.log("Show the Ofs!");
      }
    }

    function mousemove(mouseEvent, courseNode) {
      const popUpWindowWidth = popUpWindow.node().offsetWidth;
      const popUpWindowHeight = popUpWindow.node().offsetHeight;
      var x = mouseEvent.pageX - popUpWindowWidth - 6;
      var y = mouseEvent.pageY - popUpWindowHeight - 6;
      popUpWindow.style("left", x + "px").style("top", y + "px"); // set popUpWindow position on the top left.  TODO: remove "px"
      popUpWindow.html(
        `<p id="TooltipCourseName">${courseNode.data.courseTitle}</p>`
      );
    }

    function mouseleave(courseNode) {
      popUpWindow.transition().delay(200).style("opacity", 0);
      deHighlightHoverOnCourse(courseNode);
      hideOfsPath(courseNode);

      function deHighlightHoverOnCourse(courseNode) {
        d3.selectAll("#" + courseNode.id + "Rect").attr(
          "style",
          defaultUnhighlightedStyle
        );
        courseNode.data.parentIds.forEach((parentId) => {
          const parentNode = d3
            .selectAll(".courseNode")
            .filter("#" + parentId + "Node")._groups[0][0].__data__;
          deHighlightHoverOnCourse(parentNode);
          //*************************************************/
          const pathId = "#" + parentId + "To" + courseNode.id;
          d3.selectAll(pathId).attr("style", defaultUnhighlightedStyle);
          d3.selectAll("#" + parentId + "Rect").attr(
            "style",
            defaultUnhighlightedStyle
          );
        });
        //Keep highlighted course, exclude text
        $(".highlighted").not(".nodeText").attr("style", highlightStyle);
      }

      function hideOfsPath(courseNode) {
        console.log("Hide the Ofs!");
      }
    }

    function classifyHighlightedAndHighlightThem(courseNode) {
      // Add class "highlighted" to Highlight elements with id attached (Rect and Path)

      // Add Highlighted class to the highlighted node
      d3.selectAll("#" + courseNode.id + "Rect")
        .node()
        .classList.add("highlighted");
      d3.selectAll("#" + courseNode.id + "Text")
        .node()
        .classList.add("highlighted");
      courseNode.data.parentIds.forEach((parentId) => {
        /**
         * RECURSIVELY ADD HIGHLIGHTED CLASS TO GRANDPARENTS NODE
         */
        const parentNode = d3
          .selectAll(".courseNode")
          .filter("#" + parentId + "Node")._groups[0][0].__data__; //A HARDCORE WAY TO CONVERT parentID TO DAGNODE
        classifyHighlightedAndHighlightThem(parentNode);
        //******************************************/

        const pathId = "#" + parentId + "To" + courseNode.id; // Path connect source and target node
        const pathIdNode = d3.selectAll(pathId).node();
        if (pathIdNode !== null) {
          pathIdNode.classList.add("highlighted");
        }

        d3.selectAll("#" + parentId + "Rect")
          .node()
          .classList.add("highlighted");
      });
      // highlight elements when click exclude text
      $(".highlighted").not(".nodeText").attr("style", highlightStyle);
    }

    function unclassifyHighlightedAndUnhighlightThem() {
      d3.selectAll(".highlighted").attr("style", defaultUnhighlightedStyle);
      $(".highlighted").removeClass("highlighted");
      setDefaultCourseInfoBody();

      function setDefaultCourseInfoBody() {
        d3.select("#courseInfoHeader").html(`<h5>Course Info:<h5/>`);
        d3.select("#courseInfoCardBody").html(
          `<h4><i style="font-weight:250"> Click a course node to view more the course detail.<i/><h4/>`
        );
      }
    }

    function showCourseInfo(courseNode) {
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
          ? "No requirements"
          : courseNode.data.specificPrereq.replace(/['"]+/g, ""); // remove quotation mark from the specific requirenment

      // 3. Deal with the "ofs"
      const otherPrereq =
        courseNode.data.parentIdsComplex.length > 0
          ? `<label>Multi-choice prerequisites: </label>
          ${getOtherPrereqHerfElement()}
          `
          : `<label>Multi-choice prerequisites: </label> No multi choice prerequisites<br>`;

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
        <label>Course Name: </label>
        <a href="${directToCoursePage(courseNode.id)}">${
          courseNode.data.courseTitle
        }</a>
        <br>
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
        <a href="https://${courseNode.data.school}.wgtn.ac.nz/Main/">${
          courseNode.data.school
        }</a>
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
      const courseHomePage =
        "https://www.wgtn.ac.nz/courses/" + displine + "/" + code;
      // If couse code is not valid, use VUW course finder.
      const VUWcourseFinder =
        "https://www.wgtn.ac.nz/search?q=" +
        displine +
        "&filterToggle=f.Course+level%7CcourseLevel=" +
        code.charAt(0) +
        "%20&tab=courses";
      return codeRegex.test(code) ? courseHomePage : VUWcourseFinder;
    }

    clearHighlightedOnClicked();
    function clearHighlightedOnClicked() {
      // Click outside of a node within the canvas to the hide highlighted elements
      d3.selectAll(".layerRect,.highlighted").on("click", () => {
        unclassifyHighlightedAndUnhighlightThem();
      });
    }
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
    const zoomBtnContainer = svgDivContainer
      .append("div")
      .attr("id", "zoomBtnContainer")
      .html(
        '<button id="reset" class="btn btn-outline-primary btn-sm">Reset</button>' +
          '<button id="zoom_in" class="btn btn-outline-secondary btn-sm btn-circle">+</button>' +
          '<button id="zoom_out" class="btn btn-outline-secondary btn-sm btn-circle">-</button>'
      );

    // SETTING ZOOMING BUTTONS
    d3.select("#reset").on("click", reset);
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
}
