var express = require("express");
var ping = express.Router();

ping.use(function(request,response,next){
	console.log("/ping middleware...");
	next();
});

ping.get('/' , function(request,response){
	console.log("GET /ping is requested..");
	var output = [];
	output.push(
			{
				responseCode : 200,
				responseMessage : "pong"
			});
	response.send(output);
	console.log("/ping responses OK");
});

ping.post('/' , function(request,response){
	console.log("POST /ping is requested..");
	var output = [];
	output.push(
			{
				responseCode : 200,
				responseMessage : "pong"
			});
	response.send(output);
	console.log("/ping responses OK");
});
module.exports = ping;
