var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var database = require('../util/asol_db');

var info = express();
var imageDir = path.join(__dirname, '../imgs/');

info.use(multer()); // for parsing multipart/form-data
info.use(express.Router());

info.use(function(request, response, next) {
	console.log("/info middleware...");
	next();
});

info.get('/', function(request, response){
	response.send("GET info")
});

info.post('/', function(request, response){
	response.send("POST info")
});

module.exports = info;
