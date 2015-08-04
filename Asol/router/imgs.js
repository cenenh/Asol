var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var database = require('../util/asol_db');

var imgs = express();
var imageDir = path.join(__dirname, '../imgs/');

imgs.use(multer()); // for parsing multipart/form-data
imgs.use(express.Router());

imgs.use(function(request, response, next) {
	console.log("/imgs middleware...");
	next();
});

imgs.get('/', function(request, response){
	console.log("GET /imgs is requested..")
	fs.readdir(imageDir, function(err,files){
		var res = [];
		var fileCount = files.length;
		console.log("In server : " + files);
		for(var i=0;i<fileCount;i++){
			if(files[i].toLowerCase().match(".png") || files[i].toLowerCase().match(".jpg") || files[i].toLowerCase().match(".jpeg")){
				res.push(files[i])
			} // check extension
		}	//for
		console.log("will send arr : "+ res);
		response.setHeader("Content-Type", "text/html");
		response.send(res);
	});//readdir
});//get '/'

imgs.get('/:imgName', function(request, response){
	console.log("GET /imgs/" + request.params.imgName+ " is requested..")
	var filename = imageDir + request.params.imgName;
	fs.readFile(filename, function(err,data){
		if(!err){
			response.sendFile(filename,function(err){
				if(err){
					console.log("Send image " + filename+ " error!");
					response.send(err);
				}
				else{
					console.log("Sent: ", filename+" sucess!");
				}
			});
		} // if no err
		else{
			response.setHeader("Content-Type", "text/html");
			response.send("no such file");
		} // no such file
	})
});

imgs.post('/', function(request, response){
	response.setHeader("Content-Type", "text/html");
	response.send("POST imgs")
});

module.exports = imgs;
