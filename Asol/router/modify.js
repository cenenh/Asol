var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
//npm install body-parser
var multer = require('multer');
//npm install multer
var mysql = require('mysql');
//npm install mysql
var crypto = require("crypto");
//npm install crypto
var modify = express();

modify.use(bodyParser.json()); // for parsing application/json
modify.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
modify.use(multer()); // for parsing multipart/form-data
modify.use(express.Router());

modify.use(function(request, response, next) {
	console.log("/modify middleware");
	next();
});

modify.post('/', function(request, response) {
	console.log("/modify is requested..");
});
module.exports = modify;
