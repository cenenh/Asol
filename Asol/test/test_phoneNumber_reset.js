var parser = require('../util/asol_parse');

var a = "01038238831"; //11
var b = "0108889090" //10
var c = "010-3823-8831"; //13
var d = "010-343-9999"; //12

console.log(parser.phoneParsing(a));
console.log(parser.phoneParsing(b));
console.log(parser.phoneParsing(c));
console.log(parser.phoneParsing(d));
