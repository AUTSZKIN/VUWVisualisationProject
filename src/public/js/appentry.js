// Before using express in app.js
// import * as d3dag from "../../../module/d3-dag-047.js";

/*********************************/
import * as d3dag from "/src/public/d3-dag/d3-dag-047.js";
import { rawCourseDataToJsonArray } from "/src/dataAndParser/rawCourseDataParser.js";
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

/**
 * Parse a the RAW txt data and save it
 */
const rawDataUrl =
  "https://raw.githubusercontent.com/AUTSZKIN/VUWVisualisationProject/main/src/dataAndParser/rawtxt/ecs-sms-courses.txt";

fetch(rawDataUrl).then((response) => {
  response.text().then((data) => {
    var courseJsonArray = rawCourseDataToJsonArray(data);
    console.log(JSON.stringify(courseJsonArray));
  });
});
