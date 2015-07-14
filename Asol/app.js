var http = require("http");
var express = require("express");
var ping = require("./router/ping");
var join = require("./router/join");
var login = require("./router/login");
var modify = require("./router/modify");
var upload = require("./router/upload");


var app = express();


app.use("/ping" , ping);
app.use("/join" , join);
app.use("/login", login);
app.use("/modify", modify);
app.use("/upload", upload);

http.createServer(app).listen(3333, function() {
	console.log("Hello World!");
	console.log("Asol Server Running..");
	
});
