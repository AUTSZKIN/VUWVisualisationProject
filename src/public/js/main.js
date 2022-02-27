import * as d3 from "https://unpkg.com/d3@6.2.0?module"; // "bare" import d3-dag remotely using unpkg

const nodeRadius = 20;
const viewBoxX = -nodeRadius * 15;
const viewBoxY = nodeRadius * 7; // Controling (viewbox view of nodes) Node Position FIXME: Find a better way
var viewBoxWidth = nodeRadius * 100;
var viewBoxHeight = nodeRadius * 112.3; // These two controls the aspect ratio of mainSVG/svgDivContainer
const default_node_edge_strokeStyle = "stroke: grey; stroke-width: 1;";
const node_edge_highlightStyle = "stroke: red; stroke-width: 3;";

function drawNav() {
  const data = [
    {
      id: "Course Pathways Visualisation",
      url: "https://vuwvisual.herokuapp.com/",
      status: "active",
    },
    { id: "About VUW", url: "https://www.wgtn.ac.nz/about" },
    { id: "Future Student", url: "https://www.wgtn.ac.nz/study" },
    {
      id: "International Student",
      url: "https://www.wgtn.ac.nz/international",
    },
    { id: "Current Student", url: "https://www.wgtn.ac.nz/students" },
    { id: "myTools", url: "https://www.wgtn.ac.nz/api/toolbar/students" },
    { id: "Blackboard", url: "https://blackboard.vuw.ac.nz/" },
    {
      id: "Maps",
      url: "https://www.wgtn.ac.nz/about/campuses-facilities/campuses",
    },
  ];
  const nav = d3.select("body").append("div").attr("id", "nav");
  const navContainer = nav.append("div").attr("id", "navContainer");
  const vicLinksUL = navContainer.append("ul").attr("id", "vicLinksUL");
  const list = vicLinksUL
    .selectAll("li")
    .data(data)
    .enter()
    .append("li")
    .append("a")
    .attr("href", (d) => d.url)
    .attr("class", (d) => d.status)
    .text((d) => d.id);
}

function drawHeader() {
  const siteheader = d3.select("body").append("div").attr("id", "siteheader");
  const headerContainer = siteheader
    .append("div")
    .attr("id", "headerContainer");
  headerContainer.html(
    `<div id="logo">
      <a title="Victoria University of Wellington homepage" href="https://www.wgtn.ac.nz">
      <img  alt="Victoria University of Wellington - Te Whare Wānanga o te Ūpoko o te Ika a Māui"
      src="https://ecs.wgtn.ac.nz/vic-ui-kit/images/logo-white-full.svg">
      </a>
      </div>
      
      <div id="site-intro">
        <a href="https://vuwvisual.herokuapp.com/"><h2 id="maintitle">Course Pathway Visualisation</h2></a>
        <a href="https://www.wgtn.ac.nz/ecs"><h3 id="schooltitle">School of <a id="schoolname"> Engineering and Computer Science</a></h3></a>
      </div>
      `
  );
  //const mainheader = d3.select("body").append("div").attr("id", "mainheader").append("h3").text("Course Filter");
  d3.select("body").append("div").attr("id", "cardsContainer");
}

function drawFilter() {
  const cardsContainer = d3.select("#cardsContainer");
  const filterForm = cardsContainer
    .append("form")
    .attr("class", "form form-horizontal")
    .attr("id", "filterCard")
    .attr("role", "form");
  const formCard = filterForm
    .append("div")
    .attr("class", "card")
    .attr("id", "filterCardContent");
  const cardHeading = formCard.append("div").attr("class", "card-header");
  cardHeading.append("h5").text("School and Course Filter");
  const cardBody = formCard
    .append("div")
    .attr("class", "card-body")
    .attr("id", "cardBody");

  /** SCHOOL SELECTION */
  const schoolContainer = cardBody
    .append("div")
    .attr("class", "schoolSelectorContainer form-group");
  const schoolData = [
    { id: "" }, //(placeholder)
    { id: "ECS - School of Engineering and Computer Science" },
    { id: "SMS - School of Mathematics and Statistics" },
    { id: "SIM - School of Information Management" },
    { id: "SCPS - School of Chemical & Physical Sciences" },
    { id: "SEF - School of Economics & Finance" },
    { id: "SDI - School of Design Innovation" },
  ];
  schoolContainer.append("label").attr("class", "paneltext").text("School:");

  const schoolPicker = schoolContainer
    .append("select")
    .attr("class", "selectpicker");
  schoolPicker.append("option").attr("selected", "").text("All"); // Default Select
  schoolPicker
    .selectAll("option")
    .data(schoolData)
    .enter()
    .append("option")
    .text((school) => school.id); // All listed School

  /** COURSE SEARCH */
  var searchContainer = cardBody //TODO: Fix search not working in cardBody
    .append("div")
    .attr("class", "searchContainer form-group");
  searchContainer.append("label").attr("class", "paneltext").text("Course(s):");
  searchContainer
    .append("input")
    .attr("type", "string")
    .attr("id", "searchInput");
  searchContainer
    .append("button")
    .attr("type", "button") //this fixes button auto-refresh console
    .attr("id", "searchButton")
    .text("Search");

  /** NOTES */
  // cardBody
  //   .append("div")
  //   .attr("class", "notes")
  //   .html(
  //     "<div class='searchGuide'>Type in any course(s) or/and discipline(s) interested, use space or comma to separate multiple query ( e.g.,  CYBR471 MATH1 STA or CYBR471,MATH1,STA )</div>" +
  //       "<div class='footnoteHeader'> User guide: </div>" +
  //       "<div class='footnoteText1'>* Hover on or click course node(s) to show and highlight its prerequisites, click blank area to clear the highlight</div>" +
  //       "<div class='footnoteText1'>* L100 T2 = Level 100 Courses in Trimester 2</div>" +
  //       '<div class="footnoteText1">* Courses in grey are not available at the moment. e.g.,  <img id="fadedCourse" alt="fadedCourse" src="https://s2.loli.net/2022/01/17/dpin4xJosT3NUSa.png" width="43px" style="position: absolute;"/></div>' +
  //       '<div class="footnoteText1">* Course with asterisk has specific requriement(s), see the course info panel. <br> e.g., <img id="courseWithAsterisk" alt="courseWithAsterisk" src="https://s2.loli.net/2022/01/17/1JUPrIMytF8HV4N.png" width="43px" /></div>'
  //   );

  /** User Guides */
  cardBody
    .append("div")
    .attr("class", "notes")
    .html(
      "<div class='searchGuide'>Type in any course(s) or/and discipline(s) interested, use space or comma to separate multiple query ( e.g.,  CYBR471 MATH1 STA or CYBR471,MATH1,STA )</div>" +
        '<div class="userguideTooltip">  <i class="bi bi-question-circle-fill" style="font-size: normal"></i> About & Usage' +
        "<div class='userguideTooltipContent'>" +
        "<div class='footnoteTextInstrc'>This is an interactive visualisation system aims to present students and interested parties with an overview of the VUW courses from different schools to help ﬁnd course prerequisite relationships and details.</div>" +
        "<div class='footnoteText1'>* To zoom in/out on the visualisation use mouse wheel or the [-/+] buttons </div>" +
        "<div class='footnoteText1'>* Hover or click on course node(s) to show and highlight its prerequisites, use [Clear] button or click blank area to clear the highlighted elements </div>" +
        "<div class='footnoteText1'>* The Sloid lines indicate the No-choice prerequisite connection and the Dotted lines indicate the Multi-choice prerequisite connection.  </div>" +
        "<div class='footnoteText1'>* Click [Reset] button to re-position the visualisation </div>" +
        "<div class='footnoteText1'>* L100 T2 = Level 100 Courses in Trimester 2</div>" +
        '<div class="footnoteText1">* Courses in grey are not available at the moment. e.g.,  <img id="fadedCourse" alt="fadedCourse" src="https://s2.loli.net/2022/01/17/dpin4xJosT3NUSa.png" width="43px" style="position: absolute;"/></div>' +
        '<div class="footnoteText1">* Course with asterisk has specific requriement(s), see the course info panel. <br> e.g., <img id="courseWithAsterisk" alt="courseWithAsterisk" src="https://s2.loli.net/2022/01/17/1JUPrIMytF8HV4N.png" width="43px" /></div>' +
        "</div>" +
        "</div>"
    );

  var tooltip = document.querySelector(".userguideTooltip");
  tooltip.addEventListener("click", function () {
    if (this.classList.contains("active")) {
      this.classList.remove("active");
    } else {
      this.classList.add("active");
    }
  });
}

function drawCourseInfoField(s) {
  const cardsContainer = d3.select("#cardsContainer");
  const infoFieldForm = cardsContainer
    .append("form")
    .attr("class", "form form-horizontal")
    .attr("id", "courseInfoCard")
    .attr("role", "form");
  const formCard = infoFieldForm
    .append("div")
    .attr("class", "card text-black bg-warning mb-3")
    .attr("id", "courseInfoCardContent");
  const courseInfoCardHeading = formCard
    .append("div")
    .attr("class", "card-header")
    .attr("id", "courseInfoHeaderDiv");

  // Card Heading:Course Code
  courseInfoCardHeading
    .append("h5")
    .text("Course Information")
    .attr("id", "courseInfoHeader");

  // Card Body: Course detail
  const courseInfoCardBody = formCard
    .append("div")
    .attr("class", "card-body")
    .attr("id", "cardBody");
  courseInfoCardBody
    .append("div")
    .attr("id", "courseInfoCardBody")
    .html(
      `<h4><i style="font-weight:250"> Click a course node or search using course code to view more detail ( e.g., ENGR123 )<i/><h4/>`
    );
}

function drawSVG() {
  const svgDivContainer = d3
    .select("body")
    .append("div")
    .attr("id", "svgDivContainer");

  const mainSVG = svgDivContainer
    .append("svg")
    .attr("id", "mainSVG")
    .attr("width", "100%") // same size as svgDivContainer
    .attr("height", "100%")
    // Autosize the viewbox to fit window, viewbox 负责网页自动比例缩放, 等效与以上两行 如果不想则删除以下两行并自行更改svg参数
    .attr("preserveAspectRatio", "xMaxYMax slice")
    .attr(
      "viewBox",
      `${viewBoxX} ${viewBoxY} ${viewBoxWidth * 2} ${viewBoxHeight}`
    );

  /** FOOTNOTES */
  d3.select("#svgDivContainer")
    .append("div")
    .attr("id", "footnoteAndZoomContainer");
  // .append("div")
  // .attr("id", "footnote")
  // .html(
  //   "<text>* L100 T2 = Level 100 Courses in Trimester 2<br>" +
  //     "* Faded courses are not available at the moment. For example: </text>" +
  //     '<img id="fadedCourse" alt="fadedCourse" src="https://s2.loli.net/2022/01/17/dpin4xJosT3NUSa.png" width="43px" style="position: absolute;"/><br>' +
  //     "<text>* Course with asterisk ( * ) has specific requriement, please see the course info panel. For example: </text>" +
  //     '<img id="courseWithAsterisk" alt="courseWithAsterisk" src="https://s2.loli.net/2022/01/17/1JUPrIMytF8HV4N.png" width="43px" /><br>'
  // );
  /** FOOTNOTES */

  drawLayer();
}

function drawLayer() {
  // Draw layer, Level and trimester info in an array
  var trimesters = [
    "L100 T1",
    "L100 T2",
    "L200 T1",
    "L200 T2",
    "L300 T1",
    "L300 T2",
    "L400 T1",
    "L400 T2",
  ];

  const levelLayers = d3
    .select("#mainSVG")
    .append("g")
    .attr("class", "layerRectContainer")
    .selectAll("g")
    .data(trimesters)
    .enter()
    .append("g")
    .attr("class", "layerRect");

  // Layer Rectangles
  levelLayers
    .append("rect")
    .attr("fill", (d, i) => {
      return i % 2 ? "rgb(252,252,252)" : "rgb(255,254,206)";
    })
    .attr("x", viewBoxX)
    .attr("y", (d, i) => {
      return i * (viewBoxHeight / trimesters.length) + viewBoxY;
    })
    .attr("width", "100%")
    .attr("height", viewBoxHeight / trimesters.length)
    .attr("style", (d, i) => {
      return i % 2
        ? ""
        : `stroke:black;stroke-width:0.3px;stroke-dasharray: ${viewBoxWidth} 0 `; // bottom stroke
    });

  // Layer Texts
  levelLayers
    .append("text")
    .attr("x", viewBoxX + 50)
    .attr("y", (d, i) => {
      return (
        i * (viewBoxHeight / trimesters.length) +
        viewBoxHeight / trimesters.length / 2 +
        viewBoxY
      );
    })
    .attr("font-size", "220%")
    .text((d, i) => {
      return d;
    });
}

export function draw() {
  drawNav();
  drawHeader();
  drawFilter();
  drawCourseInfoField();
  drawSVG();
}
