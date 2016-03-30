var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var basex = require('basex');

var routes = require('./routes/index');
var users = require('./routes/users');
var search = require('./routes/search')

var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

var app = express();
var Colenso;

client.execute("OPEN Colenso");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();
app.use(router);

app.use('/', routes);
app.use('/users', users);
app.use('/search', search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*router.post('/search', function (req, res) {
  alert('here');
    console.log(req.body.title);
    console.log(req.body.description);
    res.send('Post page');
});*/


router.get('/', function (req, res) {  
  res.render('index');
});

router.post('/search', function (req, res) {  
  var query = req.body.query;
  
  if(req.body.Names){
    searchNames(query, res);
  }
  if(req.body.Title){
    searchTitles(query, res);
  }
  if(req.body.Content){
    searchContent(query, res);
  }
  //By default if no checkbox is selected search content.
  if(!(req.body.Names||req.body.Content||req.body.Title)){
    searchContent(query, res);
  }
});

splitResult = function(result, res){
  Colenso = result.split(/\r?\n/);
  res.send(Colenso);  
}

searchTitles = function(query, res){
  var txt = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in //title[contains(., \""+query+"\")] return db:path($t)";
  console.log(txt);
  client.execute(txt, function(
  error, result){
    if(error){
      console.log(error);
    }else{
      splitResult(result.result, res);
    }
  });
}

searchNames = function(query, res){
  var txt = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in //name[contains(., \""+query+"\")] return db:path($t)";
  console.log(txt);
  client.execute(txt, function(
  error, result){
    if(error){
      console.log(error);
    }else{
      splitResult(result.result, res);
    }
  });
}

searchContent = function(query, res){
  var txt = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in //body[contains(., \""+query+"\")] return db:path($t)";
  console.log(txt);
  client.execute(txt, function(
  error, result){
    if(error){
      console.log(error);
    }else{
      splitResult(result.result, res);
    }
  });
}

module.exports = app;
