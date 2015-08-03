var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');

var upload = express();
var imageDir = path.join(__dirname,'../imgs/');


upload.use(bodyParser.json()); // for parsing application/json
upload.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
upload.use(multer()); // for parsing multipart/form-data
upload.use(express.Router());
upload.use(cookieParser('asol'));
upload.use(session({
	key: 'asol_key',
	secret: 'asol',
	resave: false,
	saveUninitialized: true,
	cookie: {
		    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
	}
}));

upload.use(function(request, response, next) {
	console.log("/upload middleware..");
	next();
});

upload.get('/', function(request,response){
	console.log("GET /upload is requested..");
	var filePath = __dirname + "\\image";
	console.log("filePath = "+filePath);
	var output = [];
	output.push({
		responseCode : 400,
		responseMessage : "access using POST /upload"
	});
	response.send(output);
});

upload.post('/', function(request, response) {
	console.log("POST /upload is requested..");
	fs.exists(imageDir,function(exists){
		if(exists){
			console.log(imageDir + ' is exists..');
		}
		else {
			console.log('i will mkdir()');
			fs.mkdir(imageDir, 0666, function(error){
				if(error){
					console.log('mkdir() error');
					throw error;
				}
			});
		}
	});
	var body = request.body;
	var user = {
		unum: body.unum,
		phone: body.phone,
		dong: body.dong,
		ho: body.ho
	};

	fs.readFile(request.files.image.path, function(err, data){
		if (!err)
		{
			var originalFileName = request.files.image.originalname;
			var fileExtension = request.files.image.extension;
			console.log("orginal name : " + originalFileName);
			console.log("Received File Extension : " + fileExtension);
			var output = [];
			//__dirname + "/" + ".." + "/imgs/"
			var imgDir = imageDir + request.files.image.originalname;
			var newFileName = "asol_"+ user.unum + "_" + user.dong + "_" + user.ho + "_" + user.phone.substring(7) + "." + fileExtension;
			var newImgDir = imageDir + newFileName;
			console.log("it will be saved at : " + newImgDir);

			fs.writeFile(imgDir, data, function(err) {
				console.log("Write File! " + newFileName);
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
								responseMessage : "Upload(File-Rename) Fail"
							});
							response.send(output);
						}
					});
				}
				else{
					output.push({
						responseCode : 400,
						responseMessage : "Upload(WriteFile in Server) Fail"
					});
					response.send(output);
				}
			});
		}
		else {
			var output2=[];
			output2.push({
				responseCode : 400,
				responseMessage : "Upload(ReadFile in Server) Fail"
			});
			response.send(output2);
		}
	});
});
module.exports = upload;
