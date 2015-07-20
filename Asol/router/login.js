var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var crypto = require("crypto");
var cookieParser = require('cookie-parser'); 
var expressSession = require('express-session');

var login = express();

login.use(bodyParser.json()); // for parsing application/json
login.use(bodyParser.urlencoded({
	extended : true
})); // for parsing application/x-www-form-urlencoded
login.use(multer()); // for parsing multipart/form-data
login.use(express.Router());
login.use(expressSession({secret:'AsolAsolAsol'}));


login.use(function(request, response, next) {
	console.log("/login middleware...");
	next();
});

//get 요청시 error 
login.get('/', function(request, response){
	console.log("GET /login is called..");
	var output = {};
	if(request.session){
		output = {
			responseCode : 200,
			responseMessage : "the session exists",
			userName : request.session.userInfo.name,
			userPhone : request.session.userInfo.phone,
		};
	}
	else{
		output = {
				responseCode : 400,
				responseMessage : "Re-login with POST /login"
		};
	}	
	response.send(output);
});

login.post('/', function(request, response) {
	
	console.log("/login is requested..");
	var body = request.body;
	var key = "asol";
	
	//암호화
	var cipher = crypto.createCipher("aes128", key);
	var encryptedPassword = cipher.update(body.password, "utf-8", "hex");
	encryptedPassword += cipher.final("hex");

	var user = {
		phone : body.phone,
		pw : encryptedPassword
	};
	
	var dbConnection = mysql.createConnection({
		host : 'localhost',
		port : 3306,
		user : 'root',
		password : 'chldbwls',
		database : 'asol_local'
	}); // Create DataBase Connection 

	dbConnection.connect(function(err) {
		if (err) {
			console.log("DB Connectio Error");
			console.log(err);
		}
	}); // DataBase Connection Test
	console.log("/login requested User Information : " + JSON.stringify(user));

	var query = dbConnection.query("select * from USER where phone = "+ mysql.escape(body.phone) + " and pw=  "+ mysql.escape(encryptedPassword), function(err, result) {

		if (err) { //DB error
			console.log(err);
			var failResult = [];
			failResult.push(
					{
						responseCode : 500, //internal error 
						responseMessage : "Server Internal Error"
					}
				);
			response.send(failResult);
			console.log("/login result : " + JSON.stringify(failResult));
		} else { // No error
			console.log(result);
			var successResult = [];
			var userInfo = [];
			userInfo.push(result);
			if (result.length > 0) {
				successResult.push(
						{
							responseCode : 200,
							responseMessage : "LoginSuccess",
							responseUserInfo : userInfo
						}
				);
				request.session.userInfo = result[0]; //session에 저장.
				console.log(request.session.userInfo);
			} else if (result.length === 0) {
				successResult.push(
						{
							responseCode : 400,
							responseMessage : "LoginFail"
						}
				);
			}
			response.send(successResult);
			//response.send(result);
			console.log("/login result : " + JSON.stringify(successResult));
			console.log("session stored");
			console.log(request.session.userInfo);
		}
	}); //Insert
});
module.exports = login;