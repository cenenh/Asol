var express = require('express');
var bodyParser = require('body-parser'); 
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); 

var app = express();


app.use(cookieParser());
app.use(expressSession({secret:'AsolAsolAsol'}));
app.use(bodyParser());

app.get('/', function(req, res){
  var html = '<form action="/" method="post">' +
             'Your name: <input type="text" name="userName"><br>' +
             '<button type="submit">Submit</button>' +
             '</form>';
  if (req.session.userName) {
    html += '<br>Your username from your session is: ' + req.session.userName;
  }
  res.send(html);
});

app.post('/', function(req, res){
  req.session.userName = req.body.userName;
  res.redirect('/');
});

app.listen(8011);