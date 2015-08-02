var mysql = require('mysql');

function asol_db(){
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
  return dbConnection;
}

module.exports = asol_db;
