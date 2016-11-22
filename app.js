var express = require('express');
var app = express();
var bp = require('body-parser');
var pgp = require('pg-promise')();
var db = pgp('postgres://postgres:Laughs248@localhost:5432/blog');

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.set('views', __dirname+'/views');

app.use(bp.urlencoded({ extended: false }))

app.use(bp.json())

app.use( function( req, res, next ) {
  if(req.query.method == 'delete') {
    req.method = 'DELETE';
    req.url = req.path;
  }
  next();
});

app.get('/', function(req,res,next){
  db.any('SELECT * FROM posts')
    .then(function(posts){
      return res.render('index', {posts: posts})
    })
    .catch(function(err){
      return next(err);
    });
});

app.get('/:id/post', function(req,res,next){
  var id = parseInt(req.params.id);
  db.one('SELECT * FROM posts WHERE id=$1', id)
    .then(function(posts){
      return res.render('post', {posts: posts})
    })
    .catch(function(err){
      return next(err);
    });
});

app.get('/posts/:id/edit', function(req,res,next){
  var id = parseInt(req.params.id);
  db.one('SELECT * FROM posts WHERE id = $1', id)
    .then(function (posts) {
      res.render('edit', {posts: posts})
    })
    .catch(function (err) {
      return next(err);
    });
});

app.get('/posts/new', function(req,res,next){
  res.render('new');
});

app.post('/posts/new', function(req,res,next){
  var id = parseInt(req.params.id);
  db.none('INSERT INTO posts(title, blurb) VALUES ($1,$2)',
     [req.body.title, req.body.blurb])
    .then(function (posts) {
      res.redirect('/');
    })
    .catch(function (err) {
      return next(err);
    });
});

app.post('/posts/:id/edit', function(req,res,next){
   db.none('UPDATE posts SET title=$1, blurb=$2 WHERE id=$3',
      [req.body.title, req.body.blurb, parseInt(req.params.id)])
      .then(function () {
        res.redirect('/');
      })
      .catch(function (err) {
        return next(err);
      });
});

app.delete('/posts/:id', function(req, res, next){
  var id = parseInt(req.params.id);
  db.result('DELETE FROM posts WHERE id = $1', id)
    .then(function (result) {
      res.redirect('/');
    })
    .catch(function (err) {
      return next(err);
    });
});

app.listen(3000, function(){
  console.log('Application running on localhost on port 3000');
});
