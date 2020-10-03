import EXPRESS from 'express';

const ROUTER = EXPRESS.Router();

/* GET home page. */
ROUTER.get('/', function (req, res, next) {
  res.status(200).json({
    code: 0,
    message: 'Home'
  });
});

export default ROUTER;
