// Before using express in app.js
// import * as d3dag from "../../../module/d3-dag-047.js";

/*********************************/
import * as d3dag from "/src/public/d3-dag/d3-dag-047.js";
import { draw } from "./main.js";
import sugiyama from "./sugiyamaDagDrawing.js";

const courseJsonDataUrl =
  "https://raw.githubusercontent.com/AUTSZKIN/VUWVisualisationProject/main/src/dataAndParser/converted/ecs-sms-courses.json";

drawLocalData();

function drawLocalData() {
  fetch(courseJsonDataUrl)
    .then((response) => response.json())
    .then((json) => {
      var dag = d3dag.dagStratify()(json);
      sugiyama()(dag);
    });
  draw();
}
