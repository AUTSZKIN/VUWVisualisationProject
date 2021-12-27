// Before using express in app.js
// import * as d3_dag from "../../../module/d3-dag-047.js"; // import local modified d3-dag library

/*********************************/
import * as d3_basic from "https://unpkg.com/d3@6.2.0?module"; // "bare" import d3-dag remotely using unpkg
import * as d3_dag from "/src/public/d3-dag/d3-dag-047.js"; // Starting from /src/, import local modified d3-dag library

export default function () {
  const d3 = Object.assign({}, d3_basic, d3_dag); // Combine d3_base and d3_dag as one Library
  const highlightStyle = "stroke:red; stroke-width:4.5";
  const hoverHighlightStyle = "stroke:purple; stroke-width:3.5";
  const defaultUnhighlightedStyle = "stroke:grey; stroke-width:1";

  function sugiyama(dag) {
    const layering = d3.layeringLongestPath();
    const decross = d3.decrossTwoLayer();
    const coord = d3.coordCenter();

    var xSep = 3600,
      ySep = 2250; // Controling Node Seperation/Position  FIXME: Find a better way

    const sugiyamaOperator = d3
      .sugiyama()
      .size([xSep, ySep]) //node size
      .layering(layering)
      .decross(decross)
      .coord(coord);

    sugiyamaOperator(dag);
    draw(dag);
    zoomPan();
  }

  return sugiyama;

  function draw(dag) {
    // console.dir(dag);
    // const defs = svgSelection.append("defs"); // For gradients
    // Use computed sugiyamaOperator (formerly layout)
    // sugiyamaOperator(dag);

    const steps = dag.size();
    const interp = d3.interpolateRainbow;
    const colorMap = {};

    // console.log("class of dag: " + dag.constructor.name); //get object class
    // console.log(Object.getOwnPropertyNames(dag)); //get object properties
    // console.log(dag.dagRoots);
    // console.log("dag.links: " + Object.getOwnPropertyNames(dag.links()[0]));
    //dag.dagRoots.forEach((d) => console.log(d));
    //LayoutDagRoot {dagRoots: Array(6)}//
    // var dagit = dag[Symbol.iterator]();
    // var next = dagit.next();
    // while (!dagit.next().done) {
    //   console.log(next.value);
    //   next = dagit.next();
    // }

    dag.dagRoots.forEach((node, i) => {
      colorMap[node.id] = interp(i / steps);
    });

    drawPaths(dag);
    drawNodes(dag);
    d3.selectAll(".level100 *,#level100 *").style("opacity", 0);
  }

  function drawPaths(dag) {
    // Draw edges
    const line = d3
      .line()
      .curve(d3.curveBundle.beta(0.5))
      .x((d) => d.x)
      .y((d) => d.y);

    // Plot edges
    d3.select("#mainSVG")
      .selectAll("path")
      .data(dag.links())
      .enter()
      .append("path")
      .attr("d", (data, i) => {
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
    const nodeW = 90,
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
      .attr("class", "nodeText");
  }

  function drawTooltipAndCourseInfoPanel() {
    var isCourseHighlighted = false;

    const popUpWindow = d3
      .select("body")
      .append("div")
      .attr("class", "popUpWindow");

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

      // console.log("Node: ");
      // console.log(node);
      // console.log(" Rect: ");
      // console.log(rect);
      // console.log("isRectHighlight?: " + isRectHighlighted);

      if (isRectHighlighted) {
        d3.selectAll(".highlighted").attr("style", defaultUnhighlightedStyle);
        $(".highlighted").removeClass("highlighted");
        //return;
      } else {
        classifyHighlightNodes(courseNode);
        d3.selectAll(".highlighted").attr("style", highlightStyle);
        popUpWindow.style("visibility", "hidden"); // hide popup window
        showCourseInfo(courseNode);
        isCourseHighlighted = true;
        //return;
      }
    }
    //**********************************************************************
    // Click outside of a node within the canvas to the hide highlighted elements
    d3.selectAll(".layerRect,.highlighted").on("click", () => {
      d3.selectAll(".highlighted").attr("style", defaultUnhighlightedStyle);
      $(".highlighted").removeClass("highlighted");
    });
    //**********************************************************************

    function mouseover(courseNode) {
      popUpWindow.transition().duration(200).style("opacity", 0.95);
      popUpWindow.style("visibility", "visible");
      highlightHoverOnCourse(courseNode);
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
      d3.selectAll(".highlighted").attr("style", highlightStyle); //Keep highlighted course
    }

    function showCourseInfo(courseNode) {
      const courseId = courseNode.id;
      d3.select("#courseInfoHeader").text("Course code: " + courseId);
      const cardBody = d3.select("#courseInfoCardBody");

      // Handle prerequisites list and URL
      const prereq =
        courseNode.data.parentIds.length > 0
          ? getPrereqHerfElement()
          : "No Prerequisite";

      function getPrereqHerfElement() {
        var prereqList = ``;
        courseNode.data.parentIds.forEach(function (parentCourse) {
          prereqList += `<a href="${directToCoursePage(
            parentCourse
          )}">${parentCourse}&ensp;</a>`; //add space: &ensp;
        });
        return prereqList;
      }

      // Actual Course detail body //
      cardBody.html(() => {
        return `
        <label>Course Name: </label>
        <a href="${directToCoursePage(courseNode.id)}">${
          courseNode.data.courseTitle
        }</a>
        <br>
        <label>Prerequisites: </label>
        ${prereq}
        <br>
        <label>Trimester: </label>
        ${courseNode.data.trimester}<br>
        <label>School: </label>
        <a href="https://${courseNode.data.school}.wgtn.ac.nz/Main/">${
          courseNode.data.school
        }</a>
        `; // TODO: add url
      });
    }

    function directToCoursePage(courseNodeId) {
      // Here we have the course node element id
      var displine = courseNodeId.match(/[a-zA-Z]+|[0-9]+/g)[0];
      var code = courseNodeId.match(/[a-zA-Z]+|[0-9]+/g)[1];
      //window.open("https://www.wgtn.ac.nz/courses/" + displine + "/" + code);
      return "https://www.wgtn.ac.nz/courses/" + displine + "/" + code;
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
  }

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
      const pathId = "#" + parentId + "To" + courseNode.id; // Path connect source and target node
      d3.selectAll(pathId).attr("style", hoverHighlightStyle);
      d3.selectAll("#" + parentId + "Rect").attr("style", hoverHighlightStyle);
    });
  }

  // Add class "highlighted" to Highlight elements with id attached (Rect and Path)
  function classifyHighlightNodes(courseNode) {
    // Add Highlighted class to the highlighted node
    d3.selectAll("#" + courseNode.id + "Rect")
      .node()
      .classList.add("highlighted");

    courseNode.data.parentIds.forEach((parentId) => {
      /**
       * RECURSIVELY ADD HIGHLIGHTED CLASS TO GRANDPARENTS NODE
       */
      const parentNode = d3
        .selectAll(".courseNode")
        .filter("#" + parentId + "Node")._groups[0][0].__data__; //A HARDCORE WAY TO CONVERT parentID TO DAGNODE
      classifyHighlightNodes(parentNode);
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
  }
}
