var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index', { posts: [{title: 'Devon fix this'}, {title: 'Devon Fix this'}, {title: 'Devon Fix This'}], user: null });
});

app.get('/login', (req, res) => {
  res.render('login', { user: null });
});

app.post('/login', (req, res) => {
  console.log("Hello World");
});

app.listen(port);
console.log("Listening on port", port)
