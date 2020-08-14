const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

/* GET users listing. */
ROUTER.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = ROUTER;
