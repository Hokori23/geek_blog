const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

/* GET home page. */
ROUTER.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = ROUTER;
