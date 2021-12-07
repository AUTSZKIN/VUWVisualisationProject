// Before using express in app.js
// import * as d3dag from "../../../module/d3-dag-047.js";

/***************************************/

import * as d3dag from "../d3-dag/d3-dag-047.js";
import { draw } from "./main.js";
import sugiyama from "./sugiyamaDagDrawing.js";

const courseJsonDataUrl =
  "https://raw.githubusercontent.com/AUTSZKIN/VUWVisualisationProject/main/src/data/converted/ecs-sms-courses.json";

drawLocalData();
function drawLocalData() {
  fetch(courseJsonDataUrl) // fetch("http://127.0.0.1:7077/converted/ecs-sms-courses.json")
    .then((response) => response.json())
    .then((json) => {
      var dag = d3dag.dagStratify()(json);
      sugiyama()(dag);
    });
  draw();
}
