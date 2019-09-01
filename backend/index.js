const express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(4000);
console.log('Backend started up on port 4000');
