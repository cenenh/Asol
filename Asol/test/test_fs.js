var path = require('path');
var fs = require('fs');

var filePath = path.join(__dirname,'../imgs/');
console.log(filePath);

fs.stat(filePath, function(err,stats){
  // return file status
  //console.log(stats);
});

fs.readdir(filePath, function(err,files){
  //[ 'asol_46_1_208_8831.png', 'Thumbs.db' ]
  console.log(files)
  console.log("files = " + files)
  console.log("how many files = " + files.length)
  for(var i=0;i<files.length;i++){
    if(files[i].toLowerCase().match(".png") || files[i].toLowerCase().match(".jpg") || files[i].toLowerCase().match(".jpeg") || files[i].toLowerCase().match(".gif")){
      console.log(files[i])
    }
  }
});
