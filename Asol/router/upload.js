var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var fs = require('fs');
var cookieParser = require('cookie-parser'); 
var session = require('express-session');
		
var upload = express();

upload.use(bodyParser.json()); // for parsing application/json
upload.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
upload.use(multer()); // for parsing multipart/form-data
upload.use(express.Router());
upload.use(cookieParser());
upload.use(session({
	key: 'asol_key',
	secret: 'asol',
	resave: false,
	saveUninitialized: true,
	userInfo:[],
	cookie: {
		    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
	}
}));

upload.use(function(request, response, next) {
	console.log("/upload middleware..");
	var session = request.session;
	console.log(session);
	next();
});

upload.get('/', function(request,response){
	console.log("GET /upload is requested..");
	var filePath = __dirname + "\\image";
	console.log("filePath = "+filePath);
	var output = [];
	output.push(
			{
				responseCode : 400,
				responseMessage : "access using POST /upload"
			}
	);
	response.send(output);
	
});

upload.post('/', function(request, response) {
	
	console.log("POST /upload is requested..");
	//console.log(request.files.image.originalname);
	//console.log("orginal name : " + originalFileName);
	//console.log("file name : " + fileName);
	//console.log("requestFilePath : " + requestFilePath);
	//console.log("Received File : \n"+JSON.stringify(request.files));
	if(request.session !== undefined){
		var originalFileName = request.files.image.originalname;
		var fileName = request.files.image.name;
		var requestFilePath = request.files.image.path;
		console.log("hi!");
		console.log(request.session.userInfo);
		fs.readFile(request.files.image.path, function(err, data) {
			if (!err) 
			{
				var output = [];
				var imgDir = __dirname + "/" + ".." + "/imgs/" + request.files.image.originalname;
				var newFileName = "asol_"+ request.session.userInfo.unum+"_"+ request.session.userInfo.phone.substring(9);
				var newImgDir = __dirname + "/" + ".." + "/imgs/"+ newFileName;
				console.log("will saved at : " + newImgDir);
				fs.rename(imgDir, newImgDir, function(error) {
						if (!error){
							output.push(
									{
										responseCode : 200,
										responseMessage : "Upload Success"
									}
							);
						}
				});
			}
			else {
				var output2=[];
				output2.push(
						{
							responseCode : 400,
							responseMessage : "Upload Fail"
						}
				);
				response.send(output2);
			}
			
		});
	}
	else{
		var output = [];
		output.push(
				{
					responseCode : 400,
					responseMessage : "Need to re-login"
				}
		);
		response.send(output);
	}
	
});

module.exports = upload;