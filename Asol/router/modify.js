var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var crypto = require("crypto");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var modify = express();

modify.use(bodyParser.json()); // for parsing application/json
modify.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
modify.use(multer()); // for parsing multipart/form-data
modify.use(express.Router());


modify.use(function(request, response, next) {
	console.log("/modify middleware");
	next();
});

modify.get('/', function(request, response) {
	console.log("GET /modify is requested..");
	var res = {
		'responseCode' : 200,
		'responseMessage' : 'GET /modify Success'
	};
	response.send(res)
});

modify.post('/', function(request, response) {
	console.log("POST /modify is requested..");
	var res = {
		'responseCode' : 200,
		'responseMessage' : 'POST /modify Success'
	};
	response.send(res)
});

module.exports = modify;
