import { UserService as Service } from '@service';
import { User } from '@vo';
import { Restful, isDef, isUndef } from '@public';
const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

/**
 * 遍历/单个查询
 * @path /retrieve
 */
ROUTER.get('/retrieve', async (req, res, next) => {
  const { account } = req.query;
  try {
    if (!account) {
      res.status(200).json(await Service.Retrieve__All());
    } else {
      res.status(200).json(await Service.Retrieve(account));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

/**
 * 注册
 * @path /register
 */
ROUTER.post('/register', async (req, res, next) => {
  const user: User = User.clone(req.body);
  if (
    !user.checkIntegrity(['account', 'username', 'email', 'password', 'power'])
  ) {
    res.status(200).json(new Restful(1, '参数错误'));
    return next();
  }
  try {
    res.status(200).json(await Service.Create(user));
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

/**
 * 登陆
 * @path /login
 */
ROUTER.post('/login', async (req, res, next) => {
  const user: User = User.clone(req.body);
  if (!user.checkIntegrity(['account', 'password'])) {
    res.status(200).json(new Restful(1, '参数错误'));
    return next();
  }
  try {
    res.status(200).json(await Service.Login(user));
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

/**
 * 编辑
 * @path /edit
 * @description 至少需要account，如果更改密码的话，需要加上old_password参数
 */
ROUTER.post('/edit', async (req, res, next) => {
  const user: User = User.clone(req.body);
  const old_password = req.body.old_password;
  if (!user.checkIntegrity(['account'])) {
    res.status(200).json(new Restful(1, '参数错误'));
    return next();
  }
  if ((old_password && !user.password) || (!old_password && user.password)) {
    res.status(200).json(new Restful(1, '参数错误'));
    return next();
  }

  try {
    if (user.password) {
      res
        .status(200)
        .json(await Service.EditIncludePassword(user, old_password));
      return next();
    }
    res.status(200).json(await Service.Edit(user));
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});


/**
 * 注销
 * @path /delete
 * @description 暂时是只有power <= 1的账号才能注销别人的账号，逻辑实现在UserService层
 */
ROUTER.post('/delete', async (req, res, next) => {
  const { account, password } = req.body;
  try {
    res
      .status(200)
      .json(await Service.Delete(res.locals.userAccount, account, password));
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

export default ROUTER;
