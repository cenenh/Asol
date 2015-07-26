// Test if dir is exists & mkdir
var path = require('path');
var fs = require('fs');

var filePath = path.join(__dirname,'../imgs');
console.log(filePath);
path.exists(filePath,function(exists){
  if(exists){
    console.log('exists');
  }
  else {
    console.log('i will mkdir()');
    fs.mkdir(filePath, 0666, function(error){
      if(error){
        console.log('mkdir() error')
      }
    });
  }
});
