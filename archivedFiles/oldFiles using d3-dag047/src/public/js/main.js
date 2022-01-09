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
      // url: "http://localhost:8080/",
      status: "active",
    },
    { id: "Future Student", url: "https://www.wgtn.ac.nz/study" },
    {
      id: "International Student",
      url: "https://www.wgtn.ac.nz/international",
    },
    { id: "Current Student", url: "https://www.wgtn.ac.nz/students" },
    { id: "About VUW", url: "https://www.wgtn.ac.nz/about" },
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
  const mainheader = d3.select("body").append("div").attr("id", "mainheader");
  mainheader.append("h3").text("Course Filter");
}

function createCardsContainer() {
  d3.select("body").append("div").attr("id", "cardsContainer");
}

function drawFilter() {
  const cardsContainer = d3.select("#cardsContainer");
  const filterForm = cardsContainer
    .append("form")
    .attr("class", "form form-horizontal")
    .attr("id", "filterCard")
    .attr("role", "form");
  const formCard = filterForm.append("div").attr("class", "card");
  const cardHeading = formCard.append("div").attr("class", "card-header");
  cardHeading.append("h5").text("Filter and display options");
  const cardBody = formCard
    .append("div")
    .attr("class", "card-body")
    .attr("id", "cardBody");

  /** SCHOOL SELECTION */
  const schoolContainer = cardBody.append("div").attr("class", "form-group");
  const schoolData = [
    { id: "" }, //(placeholder)
    { id: "ECS" },
    { id: "SMS" },
  ];
  schoolContainer
    .append("label")
    .attr("class", "paneltext")
    .text("Select school");
  const schoolPicker = schoolContainer
    .append("select")
    .attr("class", "selectpicker")
    .on("change", schoolChanged); // When change school
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
  searchContainer
    .append("label")
    .attr("class", "paneltext")
    .text("Disciplines*");
  searchContainer
    .append("input")
    .attr("type", "string")
    .attr("id", "searchInput");
  searchContainer
    .append("button")
    .attr("type", "button") //this fixes button auto-refresh console
    .text("Search")
    .on("click", function () {
      let searchInput = document.querySelector("#searchInput"); //get user input as [object HTMLInputElement]
      searchCourse(searchInput.value);
    });

  /** NOTES */
  cardBody
    .append("div")
    .attr("class", "form-group notes")
    .text(
      `*If options on faculty or school are selected this will show additional disciplines. 
        If not this acts as a filter. (example: COMP, MATH, PHYS)`
    );
}

function drawCourseInfoField() {
  const cardsContainer = d3.select("#cardsContainer");
  const infoFieldForm = cardsContainer
    .append("form")
    .attr("class", "form form-horizontal")
    .attr("id", "courseInfoCard")
    .attr("role", "form");
  const formCard = infoFieldForm
    .append("div")
    .attr("class", "card text-black bg-warning mb-3");
  const courseInfoCardHeading = formCard
    .append("div")
    .attr("class", "card-header");

  // Card Heading:Course Code
  courseInfoCardHeading
    .append("h5")
    .text("Course code: Click a course node to view more. ")
    .attr("id", "courseInfoHeader");

  // Card Body: Course detail
  const courseInfoCardBody = formCard
    .append("div")
    .attr("class", "card-body")
    .attr("id", "cardBody");
  courseInfoCardBody
    .append("div")
    .attr("id", "courseInfoCardBody")
    .text(
      `Course detail: Click a course node to view more. 
      `
    );
}

function schoolChanged() {
  // TODO: Clean every courseEdge & courseNode highlight first
  // d3.selectAll(".courseEdge,.courseNode")
  //   .transition()
  //   .attr("style", default_node_edge_strokeStyle);

  const selectedSchool = $(this).val();
  // FIXME: Don't highlight them, but fade(invisiable) the others
  d3.selectAll("." + selectedSchool + ">.nodeRect") // Select all the .nodeRect in class #[selectedSchool], to prevent highlight text elemnt
    .transition()
    .attr("style", node_edge_highlightStyle);
}

function searchCourse(str) {
  console.log("Searching String:" + str);
}

function drawSVG() {
  /** FOOTNOTES */
  d3.select("body")
    .append("div")
    .attr("id", "footnote")
    .html(
      "<text>* L100 T2 = Level 100 Courses in Trimester 2<br>* Faded courses are not available at the moment. For example: </text>" +
        '<img id="fadedCourse" alt="fadedCourse" src="https://i.loli.net/2021/01/18/1qckDlCBV6OdAhf.png" width="55px" />'
    );
  /** FOOTNOTES */

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

  drawLayer(mainSVG);
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
    .attr("font-size", "26px")
    .text((d, i) => {
      return d;
    });
}

export function draw() {
  drawNav();
  drawHeader();
  createCardsContainer();
  drawFilter();
  drawCourseInfoField();
  drawSVG();
}
