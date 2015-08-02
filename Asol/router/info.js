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
info.use(cookieParser());
info.use(session({
	key: 'asol_key',
	secret: 'asol',
	resave: false,
	saveUninitialized: true,
	userInfo:[],
	cookie: {
		    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
	}
}));

info.use(function(request, response, next) {
	console.log("/info middleware...");
	next();
});

function do_response(request, response){
	var session = request.session.userInfo;
	var user_dong = session.dong;
	var user_ho = session.ho;
	var dbConnection = database();
	var query = dbConnection.query("select ")
}

info.get('/', function(request, response){
	do_response(request, response);
});

info.post('/', function(request, response){
	do_response(request, response);
});

module.exports = info;
