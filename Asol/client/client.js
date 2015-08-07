var http = require("http");
var express = require("express");
var fs = require("fs");
var ping = require("./ping.js");
var reqimgs = require("./reqimgs.js");
var client = express();

client.use("/ping" , ping);
client.use("/reqimgs", reqimgs);

http.createServer(client).listen(3838, function(request, response) {
	console.log("Hello World!");
	console.log("Asol Server Running in port : 3838..");
});
