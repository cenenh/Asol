var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser());
app.use(session({secret:'AsolAsolAsol'}));
app.use(bodyParser());

app.get('/', function(req, res){
  var html = '<form action="/" method="post">' +
             'Your name: <input type="text" name="userName"><br>' +
             '<button type="submit">Submit</button>' +
             '</form>';
  var session = req.session;
  name = session.userName;
  if (name) {
    html += '<br>Your username from your session is: ' + name;
  }
  res.send(html);
});

app.post('/', function(req, res){
  req.session.userName = req.body.userName;
  req.session.save();
  res.redirect('/');
});

app.listen(8011);
