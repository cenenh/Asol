var database = require('../util/asol_db');

var dbConnection = database();
console.log("yes!")
var query = dbConnection.query("select * from user",function(err,result){
  if(err){
    console.log(err);
  }
  else {
    console.log(JSON.stringify(result))
    console.log("result length = " + result.length)
      for(i in result){
      console.log("name = " + result[i].name)
      console.log("phone = " +result[i].phone)
      console.log("dong = " + result[i].dong)
      console.log("ho = " +result[i].ho)
    }
  }
});
dbConnection.end();
