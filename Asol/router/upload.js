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

	if(request.session !== undefined){

		/*
		 * {"image":{"fieldname":"image","originalname":"naver_email2.png","name":"856948828b99934e2ac9471891fb0bca.png",
		 * "encoding":"7bit","mimetype":"image/png","path":"C:\\Users\\EunHo\\AppData\\Local\\Temp\\856948828b99934e2ac9471891fb0bca.png",
		 * "extension":"png","size":17022,"truncated":false,"buffer":null}}
		 * 
		 * 
		 * */
			
		fs.readFile(request.files.image.path, function(err, data) {
			if (!err) 
			{	
				var session = request.session.userInfo;
				var originalFileName = request.files.image.originalname;
				var fileExtension = request.files.image.extension;
				console.log(request.session.userInfo);
				console.log("orginal name : " + originalFileName);
				console.log("Received File Extension : " + fileExtension);
				var output = [];
				var imgDir = __dirname + "/" + ".." + "/imgs/" + request.files.image.originalname;
				var newFileName = "asol_"+ session.unum + "_" + session.dong + "_" + session.ho + "_" + session.phone.substring(9) + "." + fileExtension;
				var newImgDir = __dirname + "/" + ".." + "/imgs/"+ newFileName;
				console.log("will saved at : " + newImgDir);
				
				fs.writeFile(imgDir, data, function(err) {
					console.log("wirte file!" + newFileName);
					if(!err){
						fs.rename(imgDir, newImgDir, function(err) {
							if(!err){
								output.push({
									responseCode : 200,
									responseMessage : "Upload OK!",
									imageFileName : newFileName
								});
								response.send(output);	
							}
							else{
								output.push({
									responseCode : 400,
									responseMessage : "Upload Fail"
								});
								response.send(output);
							}
						});
					}
					else{
						output.push({
							responseCode : 400,
							responseMessage : "Upload Fail"
						});
						response.send(output);
					}
				});
			}
			else {
				var output2=[];
				output2.push({
							responseCode : 400,
							responseMessage : "Upload Fail"
				});
				response.send(output2);
			}
		});
	}
	else{
		var output = [];
		output.push({
					responseCode : 400,
					responseMessage : "Need to re-login"
		});
		response.send(output);
	}
	
});

module.exports = upload;