import { UserAction } from '@action';
import { serverConfig, blogConfig } from '@config';
import { isUndef, QUERY_METHODS, BODY_METHODS, Restful, crypto } from '@public';

const { jwtConfig, baseURL } = serverConfig;
const JWT = require('jwt-simple');

/**
 * @description 该中间件为res添加的临时变量为
 * @param { number } userPower
 * @param { string } userAccount
 */

// 秘钥
if (isUndef(jwtConfig.key)) {
  throw new ReferenceError(
    'geekblog.config.js缺少字段: serverConfig.jwtConfig.key'
  );
}
const jwtKey = crypto(jwtConfig.key);

// token过期时间（默认：1天）
const tokenExpiresTime =
  jwtConfig.expiresTime * 1000 || 1000 * 60 * 60 * 24 * 1;

/**
 * 路由白名单
 * @description 白名单内的请求字段都应带上用户账号account，请勿修改第一个路径（注册接口）
 */
const whiteList = [`${baseURL}/user/register`, `${baseURL}/user/login`];

/**
 * 公开接口
 * @description 公开接口任何人都可以调用
 */
const publicList = [
  `${baseURL}/user/retrieve`,
  `${baseURL}/post/retrieve-id`,
  `${baseURL}/post/retrieve`,
  `${baseURL}/post/retrieve-fuzzy`
];

/**
 * 生成JWT token
 * @param { object } tokenObj
 */
const Encode = (tokenObj) => {
  if (!tokenObj) {
    throw new ReferenceError('JWT encode函数传参错误');
  }
  return JWT.encode(tokenObj, jwtKey);
};

/**
 * 解析JWT token
 * @param { jwt } encodedJWT
 */
const Decode = (encodedJWT) => {
  if (!encodedJWT) {
    throw new ReferenceError('JWT decode函数传参错误');
  }
  return JWT.decode(encodedJWT, jwtKey);
};

/**
 * 路由白名单内的请求生成JWT
 */
const SpawnJWT = (URL: string, account: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 对白名单内的注册接口进行特殊判断
      if (URL !== whiteList[0]) {
        const existedUser = await UserAction.Retrieve__Safely(account);
        if (!existedUser) {
          resolve(false);
          return;
        }
      }
      // 生成并加密JWT
      const newJWT = Encode({
        iss: `${blogConfig.blogName || 'blogName'} - ${
          blogConfig.bloggerName || 'bloggerName'
        }`, // 签发者
        aud: account, // 接收者
        exp: Date.now() + tokenExpiresTime // 过期时间
      });
      resolve(newJWT);
    } catch (e) {
      // 抛出给外层函数处理
      reject(e);
    }
  });
};

/**
 * 检查JWT合法性并更新JWT有效时间
 */
const CheckAndRefreshJWT = async (decodedJWT, res) => {
  const { iss, aud, exp } = decodedJWT;
  // JWT 过期
  if (exp > Date.now() + tokenExpiresTime) {
    return false;
  }

  // JWT 签发者错误
  if (
    iss !==
    `${blogConfig.blogName || 'blogName'} - ${
      blogConfig.bloggerName || 'bloggerName'
    }`
  ) {
    return false;
  }
  return new Promise(async (resolve, reject) => {
    // JWT 接收者错误
    const existedUser = await UserAction.Retrieve__Safely(aud);
    if (!existedUser) {
      reject(false);
      return;
    }
    // res临时变量：用户权限
    res.locals.userPower = existedUser.power;

    // 更新JWT有效时间
    decodedJWT.exp = Date.now() + tokenExpiresTime;

    resolve(true);
  });
};

/**
 * JWT中间件函数
 * @param req
 * @param res
 * @param next
 */
const JWTFilter = async (req, res, next) => {
  let flag = false;
  const URL = req.url;
  for (let i = 0; i < whiteList.length; i++) {
    const reg = new RegExp(`^${whiteList[i]}`);
    if (reg.test(URL)) {
      flag = true;
      break;
    }
  }

  /**
   * 白名单以内的请求生成JWT并弹出
   */
  if (flag) {
    console.log(`JWT 白名单以内的请求`);
    let account;
    const method = req.method;
    if (QUERY_METHODS.indexOf(method) !== -1) {
      account = req.query.account;
    } else if (BODY_METHODS.indexOf(method) !== -1) {
      account = req.body.account;
    } else {
      console.log(`不确定的请求方式，${method}`);
      // 进行邮件提醒
      res.status(500).end();
      res.locals.isResponsed = true;
      return next();
    }

    // 判断account参数类型
    if (typeof account !== 'string') {
      return res.status(200).json(new Restful(1, '参数错误'));
    }
    try {
      // 响应头加上JWT
      const newJWT = await SpawnJWT(URL, account);
      if (!newJWT) {
        res.status(401).end();
        res.locals.isResponsed = true;
        return next();
      }
      res.set('Authorization', newJWT);
    } catch (e) {
      console.log(e);
      // 进行邮件提醒
      res.status(500).end();
      res.locals.isResponsed = true;
      return next();
    }
    return next();
  }

  const encodedJWT = req.get('Authorization');
  if (!encodedJWT) {
    // 判断是否为公开接口
    for (let i = 0; i < publicList.length; i++) {
      const reg = new RegExp(`^${publicList[i]}`);
      if (reg.test(URL)) {
        console.log(`公开接口请求`);
        return next(); // 继续
      }
    }
    res.status(401).end(); // 弹出
    res.locals.isResponsed = true;
    return next();
  }

  /**
   * 白名单以外的请求检查并更新JWT
   */
  console.log(`JWT 白名单以外的请求`);
  try {
    const decodedJWT = Decode(encodedJWT);
    // 检查JWT合法性
    if (await CheckAndRefreshJWT(decodedJWT, res)) {
      // res临时变量：用户账号
      res.locals.userAccount = decodedJWT.aud;
      res.set('Authorization', Encode(decodedJWT));
      next(); // 合法通过
    } else {
      res.status(401).end(); // 弹出
      res.locals.isResponsed = true;
      return next();
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
    res.locals.isResponsed = true;
    return next();
  }
};

export default JWTFilter;
