var http = require('http');
var fs = require('fs');
var request = require('request');

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  });
}

request({
  uri: "http://127.0.0.1:3333/imgs/",
  method: "GET",
}, function(error, response, body) {
  var res = JSON.parse(response.body);
  var imgList = res.fileName;
  console.log("imageList in server : " + imgList)
  for(var i=0;i<imgList.length;i++)
  {
    var filePath = __dirname+"\\"+imgList[i];
    download("http://127.0.0.1:3333/imgs/"+imgList[i], filePath, function(){
      console.log("Download complete!")
    });
  }
});
