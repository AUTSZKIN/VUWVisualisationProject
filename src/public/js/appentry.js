// Before using express in app.js
// import * as d3dag from "../../../module/d3-dag-047.js";

/*********************************/
import * as d3dag from "/src/public/d3-dag/d3-dag-047.js";
import { rawCourseDataToJsonArray } from "/src/dataAndParser/rawCourseDataParser.js";
import { draw } from "./main.js";
import sugiyama from "./sugiyamaDagDrawing.js";

const courseJsonDataUrl =
  "https://raw.githubusercontent.com/AUTSZKIN/VUWVisualisationProject/main/src/dataAndParser/converted/2022-Data.json";
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

// const localCourseJsonDataUrl =
//   "http://127.0.0.1:5500/src/dataAndParser/converted/2022-Data.json";
// drawLocalData();
// function drawLocalData() {
//   fetch(localCourseJsonDataUrl)
//     .then((response) => response.json())
//     .then((json) => {
//       var dag = d3dag.dagStratify()(json);
//       sugiyama()(dag);
//     });
//   draw();
// }

/**
 * Parse a the RAW txt data and save it
 */
// const rawDataUrl =
//   "https://raw.githubusercontent.com/AUTSZKIN/VUWVisualisationProject/main/src/dataAndParser/rawtxt/ecs-sms-courses.txt";

const localDateUrl =
  "http://127.0.0.1:5500/src/dataAndParser/rawtxt/ecs-sms-courses-fixed.txt";
fetch(localDateUrl).then((response) => {
  response.text().then((data) => {
    // PRINT THE PARSED DATA
    // var courseJsonArray = rawCourseDataToJsonArray(data);
    // console.log(JSON.stringify(courseJsonArray));
  });
});
