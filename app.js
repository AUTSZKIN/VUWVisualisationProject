// /**
//  * node.js应用由哪几部分组成：
//  * 1. 引入required模块：我们可以使用 require 指令来载入 Node.js 模块。
//  * 2. 创建服务器：服务器可以监听客户端的请求。
//  * 3. 接收请求与响应请求：服务器很容易创建，客户端可以使用浏览器或终端发送 HTTP 请求，服务器接收请求后返回响应数据。
//  */

// import * as express from "http://unpkg.com/express@4.17.1?module"; // "bare" import d3-dag remotely using unpkg
// var express = require("express");

import express from "express";
import path from "path";
import d3dag from "d3-dag";

const __dirname = path.resolve();
var app = express();

console.log("D3 dag is here:");
console.log(d3dag);

app.set("port", process.env.PORT || 5000);

//Express:这里设置了index.html要读取的所有文档js起始点，所以路径是从这里开始的，注意了！
app.use(express.static(__dirname));

// views is directory for all template files
app.set("views", __dirname + "/src/views");
app.set("view engine", "ejs");

app.get("/", function (request, response) {
  response.render("index");
});

app.listen(app.get("port"), function () {
  console.log("Node app is running on port localhost:" + app.get("port"));
});
