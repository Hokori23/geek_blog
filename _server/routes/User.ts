import { UserService as Service } from '@service';
import { User } from '@vo';
import { Restful } from '@public';
const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
/* GET users listing. */

ROUTER.get('/', function (req, res, next) {
  console.log(req.query);
  console.log(req.body);
  res.status(200).json({
    code: 0,
    message: 'OK'
  });
});

ROUTER.get('/retrieve', function (req, res, next) {});

/**
 * 注册
 * @path /register
 */
ROUTER.post('/register', async (req, res, next) => {
  const user: User = User.clone(req.body);
  if (!user.checkIntegrity(['account', 'username', 'email', 'password'])) {
    return res.status(400).json(new Restful(1, '参数错误'));
  }
  return res.status(200).json(await Service.Create(user));
});

// ROUTER.post()
export default ROUTER;
