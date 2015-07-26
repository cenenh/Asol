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
var join = express();

join.use(bodyParser.json()); // for parsing application/json
join.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
join.use(multer()); // for parsing multipart/form-data
join.use(express.Router());

join.use(function (request,response,next)
		{
			console.log("/join middleware");
			next();
		});

join.post('/' , function (request,response){
	console.log("/join is requested..");
	var body = request.body;
	//console.log(body); //body
	// unum : user number , Auto Increase
	// name : user name
	// phone : phone number
	// uanum : apart number, Null first
	// dong : apartment dong
	// ho : apartment ho
	// pw : user password

	var key = "asol";
	var cipher = crypto.createCipher("aes128", key);
	var encryptedPassword = cipher.update(body.password,"utf-8","hex");
	encryptedPassword += cipher.final("hex");
	//console.log("EncryptedPassword : "+encryptedPassword);

	//var decipher = crypto.createDecipher("aes128", key);
	//var decryptedPassword = decipher.update(encryptedPassword, "hex", "utf-8");
	//decryptedPassword += decipher.final("utf-8");
	//console.log("DecryptedPassword : "+decryptedPassword);

	var user = {
			name : body.name,
			phone : body.phone,
			dong : body.dong,
			ho : body.ho,
			//pw : body.password
			pw : encryptedPassword
	}; //request로 받아온 user information 따와서 저장.

	var dbConnection = mysql.createConnection({
	    host : 'localhost',
	    port : 3306,
	    user : 'root',
	    password : 'chldbwls',
	    database:'asol_local'
	}); // Create DataBase Connection

	dbConnection.connect(function(err) {
		if (err)
		{
			console.log("DB Connectio Error");
			console.log(err);
		}
	}); // DataBase Connection Test
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
			else{
				failResult.push({
					responseCode : 400,
					responseMessage : "Fail"
				});
			}
			response.send(failResult);
			console.log("/join result : " + JSON.stringify(failResult));
		}
		else {
			//console.log(result);
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
