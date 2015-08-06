var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var crypto = require('crypto');
var database = require('../util/asol_db');
var parser = require('../util/asol_parse');
var join = express();

join.use(bodyParser.json()); // for parsing application/json
join.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
join.use(multer()); // for parsing multipart/form-data
join.use(express.Router());

join.use(function (request,response,next){
	console.log("/join middleware");
	next();
});

join.post('/' , function (request,response){
	console.log("/join is requested..");
	var body = request.body;
	console.log(body)
	
	//encryption
	var key = "asol";
	var cipher = crypto.createCipher("aes128", key);
	var encryptedPassword = cipher.update(body.password,"utf-8","hex");
	encryptedPassword += cipher.final("hex");

	//phone number parsing
	var phone = parser.phoneParsing(body.phone)

	var user = {
			name : body.name,
			phone : phone,
			dong : body.dong,
			ho : body.ho,
			pw : encryptedPassword
	}; //request로 받아온 user information 따와서 저장.

	dbConnection = database();
	console.log("/join requested User Information : " +  JSON.stringify(user));
	var query = dbConnection.query("insert into USER set ?", user, function(err,result){

		if(err){ //error
			var failResult = [];
			console.log(err);
			//console.log(err.toString().toLowerCase());
			if(err.toString().toLowerCase().match("phone_unique")){ //phone넘버 중복
				failResult.push({
					responseCode : 400,
					responseMessage : "Duplicate Phone Number"
				});
			}
			else { //other error
				failResult.push({
					responseCode : 400,
					responseMessage : "Fail"
				});
			}
			response.send(failResult);
			console.log("/join result : " + JSON.stringify(failResult));
		}
		else {
			var successResult = [];
			successResult.push({
				responseCode : 200,
				responseMessage : "success"
			});
			response.send(successResult);
			console.log("/join result : " + JSON.stringify(successResult));
		}
	}); //Insert
	dbConnection.end(); //Release DB Connection
});
module.exports = join;
