var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
//npm install multer
var mysql = require('mysql');
//npm install mysql
var fs = require('fs');
var parent = require('parentpath');

var upload = express();

upload.use(bodyParser.json()); // for parsing application/json
upload.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
upload.use(multer()); // for parsing multipart/form-data
upload.use(express.Router());

upload.use(function(request, response, next) {
	console.log("/upload middleware..");
	next();
});

upload.get('/', function(request,response){
	console.log("GET /upload is requested..");
	var filePath = __dirname + "\\image";
	console.log("filePath = "+filePath);
});

upload.post('/', function(request, response) {
	
	//phone이랑 같이 받아서 이름을 phone번호랑 똑같이 받아서 저장....
	
	console.log("POST /upload is requested..");
	//console.log(request.files.image.originalname);
	var originalFileName = request.files.image.originalname;
	var fileName = request.files.image.name;
	
	var requestFilePath = request.files.image.path;
	//console.log("orginal name : " + originalFileName);
	//console.log("file name : " + fileName);
	//console.log("requestFilePath : " + requestFilePath);
	//console.log("Received File : \n"+JSON.stringify(request.files));
	
	fs.readFile(request.files.image.path, function(err, data) {
		//나중에 동/호 등등...넣어서...
		var output = [];
		var imgDir = __dirname + "/"+".."+"/imgs/" + request.files.image.originalname;
		console.log("imgDir : " + imgDir);
		fs.writeFile(imgDir, data, function(error) {
			if(error){
				output.push({
					responseCode : 400,
					responseMessage : "Upload Fail"
				});
				console.log("Upload Fail");
				response.send(output);
				throw error;
			}
			else{
				output.push({
					responseCode : 200,
					responseMessage : "Upload OK"
						
				});
				console.log("Upload OK");
				response.send(output);
				
			}
		});
	});
});

module.exports = upload;