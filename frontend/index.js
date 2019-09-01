var express = require('express');
var request = require('superagent');

var app = express();

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index');
});

app.listen(port);
