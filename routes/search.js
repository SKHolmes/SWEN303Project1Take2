var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('search', { title: 'Colenso Project' });
});

router.post('/secret', function (req, res) {  
  var secret = req.body.secret;
  res.end('Password: ' + secret);
});

module.exports = router;
