// "bare" import d3-dag remotely(through internet) using unpkg
// import * as d3dag from "https://unpkg.com/d3-dag@0.6.0?module";

// import local modified d3-dag library
import * as d3dag from "./module/d3-dag-047.js";
import { draw } from "./src/public/js/main.js";
import { rawCourseDataToJsonArray } from "./src/public/js/rawCourseDataParser.js";
import sugiyama from "./src/public/js/sugiyamaDagDrawing.js";

// const rawDataURL = "http://127.0.0.1:7077/rawtxt/courses2.txt";
// const rawDataURL2 = "http://127.0.0.1:7077/rawtxt/ecs-sms-courses.txt"; // With 2 school

draw();
drawLocalData();

// Get JSON data from file
function drawLocalData() {
  fetch("http://127.0.0.1:7077/converted/ecs-sms-courses.json")
    .then((response) => response.json())
    .then((json) => {
      var dag = d3dag.dagStratify()(json);
      sugiyama()(dag);
      console.log(json);
    });
}

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

var PORT = process.env.PORT || 5000;
var express = require("express");
var app = express();
var http = require("http");
var server = http.Server(app);

app.use(express.static("client"));

server.listen(PORT, function () {
  console.log("Chat server running");
});

var io = require("socket.io")(server);

io.on("connection", function (socket) {
  socket.on("message", function (msg) {
    io.emit("message", msg);
  });
});
