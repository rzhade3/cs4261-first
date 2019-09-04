const async = require('async');
const request = require('request');
var express = require('express');
var app = express();

app.use(express.urlencoded());
app.use(express.json());

var port = process.env.PORT || 8080;

const admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cs4261-first-assignment-efcd9.firebaseio.com"
});
let db_admin = admin.firestore();

const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyCPI4a33IL785Avhxukoj9iYdlHYscjbmE",
  authDomain: "cs4261-first-assignment-efcd9.firebaseapp.com",
  databaseURL: "https://cs4261-first-assignment-efcd9.firebaseio.com",
  projectId: "cs4261-first-assignment-efcd9",
  storageBucket: "cs4261-first-assignment-efcd9.appspot.com",
  messagingSenderId: "806501506611",
  appId: "1:806501506611:web:9dba81036d686db1"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  const content = {};
  async.waterfall([
    (cb) => {
      request('https://newsapi.org/v2/everything?q=bitcoin&from=2019-08-10&sortBy=publishedAt&apiKey=89566d3d11704cb59d514303cf50a9e0', {json: true}, (err, res, body) => {
        content.news = body.articles;
        cb(null);
      });
    },
    (cb) => {
      // Replace this with user pulled from Firebase
      content.user = firebase.auth().currentUser;
      // console.log(content.user);
      cb(null);
    },
    (cb) => {
      // content.posts = [{title: 'Hello'}, {title: 'Devon Fix this'}, {title: 'Devon Fix This'}];
      content.posts = [];
      if (!content.user) {
        content.posts = [{title: 'No posts yet!'}]
      } else {
        var docRef = db_admin.collection('users').doc(content.user.uid);
        // content.posts = docRef.get("posts");

        var getDoc = docRef.get().then( doc => {
          if (!doc.exists) {
            console.log("No such document!");
          } else {
            console.log("Document data: ", doc.data());
            content.posts = doc.data().posts;
            // return doc.data().posts;
            // return true;
            // console.log(content.posts);
          }
          // content.posts = [];
          return true;
        }).catch(err => { 
          console.log("Error getting document", err);
          return false;
        });
        // console.log(docRef.posts);
      };
      // content.posts = [];
      console.log(content.posts);
      cb(null);
    }
  ], () => {
    res.render('index', content);
  });
});

app.get('/register', (req, res) => {
  return res.render('login', {user: firebase.auth().currentUser});
});

app.post('/register', (req, res) => {
  var name = req.body.user.name;
  var email = req.body.user.email;
  var password = req.body.user.password;
  var confirm = req.body.user.confirm_pwd;
  firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
    db_admin.collection('users').doc(firebase.auth().currentUser.uid).set({
      name: name,
      username: email,
      uid: firebase.auth().currentUser.uid,
      posts: []
    });
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      console.log(req.body);
      return res.redirect('/');
    });
  }, (error) => {
    return res.render('login', {errorMessage: error.message});
  });
});

app.get('/login', (req, res) => {
  res.render('login', { user: firebase.auth().currentUser });
});

app.post('/login', (req, res) => {
  console.log(req.body);
  var email = req.body.user.email;
  var password = req.body.user.password;
  firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
    return res.redirect('/');
  }, (error) => {
    return res.render('login', {errorMessage: error.message});
  });
});

app.get('/profile', (req, res) => {
  return res.render('profile', {user: firebase.auth().currentUser});
});

app.post('/post', (req, res) => {
  console.log(req.body);
  var title = req.body.user.title;
  var toAdd = {'title': title};

  var docRef = db_admin.collection('users').doc(firebase.auth().currentUser.uid);
  var getDoc = docRef.get().then( doc => {
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      console.log("Document data: ", doc.data());
      posts = doc.data().posts;
      name = doc.data().name;
      username = doc.data().username;
      uid = doc.data().uid;
      var data = {
        name: name,
        posts: posts.push(toAdd),
        uid: uid,
        username: username
      };
      var setDoc = db_admin.collection('users').doc(firebase.auth().currentUser.uid).set(data);
    }
    return true;
  }).catch(err => { 
    console.log("Error getting document", err);
    return false;
  });});

app.listen(port);
console.log("Listening on port", port)
