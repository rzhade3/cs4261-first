const async = require('async');
const request = require('request');
var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  const content = {};
  async.waterfall([
    (cb) => {
      request('https://newsapi.org/v2/everything?q=bitcoin&from=2019-08-02&sortBy=publishedAt&apiKey=89566d3d11704cb59d514303cf50a9e0', {json: true}, (err, res, body) => {
        content.news = body.articles;
        cb(null);
      });
    },
    (cb) => {
      // Should be pulled from Firebase
      content.posts = [{title: 'Devon fix this'}, {title: 'Devon Fix this'}, {title: 'Devon Fix This'}];
      cb(null);
    },
    (cb) => {
      // Replace this with user pulled from Firebase
      content.user = null;
      cb(null);
    }
  ], () => {
    res.render('index', content);
  });
});

app.get('/login', (req, res) => {
  res.render('login', { user: null });
});

app.post('/login', (req, res) => {
  console.log("Hello World");
});

app.listen(port);
console.log("Listening on port", port)
