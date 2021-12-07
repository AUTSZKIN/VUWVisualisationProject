// "bare" import d3-dag remotely(through internet) using unpkg
// import * as d3dag from "https://unpkg.com/d3-dag@0.6.0?module";

//import local modified d3-dag library

// import * as d3dag from "./module/d3-dag-047.js";
// import { draw } from "./src/public/js/main.js";
// import sugiyama from "./src/public/js/sugiyamaDagDrawing.js";
// import request from "request";

// const courseJsonDataUrl =
//   "https://raw.githubusercontent.com/AUTSZKIN/VUWVisualisationProject/main/src/data/converted/ecs-sms-courses.json";

// drawLocalData();
// function drawLocalData() {
//   request.get(courseJsonDataUrl, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var dag = d3dag.dagStratify()(body);
//       sugiyama()(dag);
//     }
//   });
//   draw();
// }

//************************************************************************************************

// import { rawCourseDataToJsonArray } from "./src/public/js/rawCourseDataParser.js";
// const rawDataURL = "http://127.0.0.1:7077/rawtxt/courses2.txt";
// const rawDataURL2 = "http://127.0.0.1:7077/rawtxt/ecs-sms-courses.txt"; // With 2 school

// fetch(courseJsonDataUrl) // fetch("http://127.0.0.1:7077/converted/ecs-sms-courses.json")
//   .then((response) => response.json())
//   .then((json) => {
//     var dag = d3dag.dagStratify()(json);
//     sugiyama()(dag);
//   });

//************************************************************************************************
// Use to convert TXT to JSON.
// function drawLocalData() {
//   fetch(rawDataURL2).then((response) => {
//     response.text().then((data) => {
//       var courseJsonArray = rawCourseDataToJsonArray(data);
//       console.log(JSON.stringify(courseJsonArray));
//       var dag = d3dag.dagStratify()(courseJsonArray);
//       sugiyama()(dag);
//     });
//   });
// }

// console.log(Object.getOwnPropertyNames(d3dag)); // Get D3-dag's properties
// loadDag().then(sugiyama()).catch(console.error.bind(console));
// async function loadDag() {
//   const dag_data = await d3.json(
//     `https://raw.githubusercontent.com/erikbrinkman/d3-dag/master/examples/grafo.json`
//   );
//   console.log(dag_data);
//   return d3dag.dagStratify()(dag_data)”
// }

//************************************************************************************************
// // create an express app
// import express from "express";

// //const express = require("express");
// const app = express();

// // use the express-static middleware
// app.use(express.static("public"));

// // define the first route
// app.get("/", function (req, res) {
//   res.sendFile("views/index.html", { root: __dirname });
// });

// // start the server listening for requests
// app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
