var http = require('http');
var express = require("express");
var fs = require('fs');
var request = require('request');

var reqimgs = express();

reqimgs.use(express.Router());

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  });
}

reqimgs.use(function(req,res,next){
	console.log("/req middleware...");
	next();
});

reqimgs.get('/', function(req, res){
  console.log("GET /reqimgs is requested..");
  var request_option = {
    uri: "http://127.0.0.1:3333/imgs/",
    method: "GET",
  };
  request(request_option, function(error, response, body) {
    var res = JSON.parse(response.body);
    var imgList = res.fileName;
    console.log("imageList in server : " + imgList)
    for(var i=0;i<imgList.length;i++)
    {
      var filePath = __dirname+"\\"+imgList[i];
      download("http://127.0.0.1:3333/imgs/"+imgList[i], filePath, function(){
        console.log(filePath + " Download complete!")
      });
    }
  });
  var output = [];
  output.push(
      {
        responseCode : 200,
        responseMessage : "reqimgs"
      });
  res.send(output);
  console.log("/reqimgs responses OK");
});
module.exports = reqimgs;
