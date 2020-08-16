import { UserAction as Action } from '@action';
import { User } from '@vo';
import { Restful, crypto } from '@public';

/**
 * 初始化超级管理员
 * @param { User } user
 */
const Create__Init = async (user: User) => {
  let restful: Restful;
  try {
    let res: Array<any> = await Action.Retrieve__All__Safely();
    if (res.length) {
      restful = new Restful(
        1,
        '已有其它用户存在，不可创建新的超级管理员账号，请登录数据库检查或重新创建数据库'
      );
      return restful;
    }

    // 加密密码
    user.password = crypto(<string>user.password);
    // 权限1: 超级管理员
    user.power = 1;
    res = await Action.Create(user);
    if (res.length) {
      restful = new Restful(2, '账号已存在');
    } else {
      // 脱敏
      delete res[0].password;
      restful = new Restful(0, '添加超级管理员成功', res[0]);
    }
  } catch (e) {
    console.log('UserService error');
    restful = Restful.initWithError(e);
  }
  return restful;
};
/**
 * 添加管理员
 * @param { User } user
 */
const Create = async (user: User) => {
  try {
    let res: Array<any> = await Action.Retrieve(<string>user.account);
    if (res.length) {
      return new Restful(1, '账号已存在');
    }
    // 加密密码
    user.password = crypto(<string>user.password);
    /**
     * 1. 权限0: 管理员
     * 2. 去除ID
     */
    user.power = 0;
    user.id = undefined;

    res = await Action.Create(user);
    // 脱敏
    delete user.password;
    return new Restful(0, '添加管理员成功', user);
  } catch (e) {
    return Restful.initWithError(e);
  }
};

/**
 * 登录
 * @param { string } account
 * @param { string } password
 */
const Login = async (account: string, password: string) => {
  let restful: Restful;
  try {
    const res: Array<any> = await Action.Retrieve(account);
    if (!res.length) {
      restful = new Restful(1, '账号不存在');
    } else {
      // 匹配密码
      if (crypto(password) === res[0].password) {
        // 脱敏
        delete res[0].password;
        restful = new Restful(0, '登陆成功', res[0]);
      } else {
        restful = new Restful(2, '账号或密码错误');
      }
    }
  } catch (e) {
    restful = Restful.initWithError(e);
  }
  return restful;
};

/**
 * 查询单个用户
 * @param { string } account
 */
const Retrieve = async (account: string) => {
  let restful: Restful;
  try {
    const res: Array<any> = await Action.Retrieve(account);
    if (!res.length) {
      restful = new Restful(1, '账号不存在');
    } else {
      restful = new Restful(0, '查询成功', res[0]);
    }
  } catch (e) {
    restful = Restful.initWithError(e);
  }
  return restful;
};

/**
 * 遍历用户
 */
const Retrieve__All = async () => {
  let restful: Restful;
  try {
    const res: Array<any> = await Action.Retrieve__All__Safely();
    if (!res.length) {
      restful = new Restful(1, '无账号');
    } else {
      restful = new Restful(0, '查询成功', res);
    }
  } catch (e) {
    restful = Restful.initWithError(e);
  }
  return restful;
};

/**
 * 编辑用户
 * @param { User }user
 */
const Update = async (user: User) => {
  let restful: Restful;
  try {
    let res: Array<any> = await Action.Retrieve(<string>user.account);
    if (!res.length) {
      restful = new Restful(1, '账号不存在');
    } else {
      await Action.Update(res[0], user);
      res = await Action.Retrieve(<string>user.account);
      restful = new Restful(0, '编辑成功', res[0]);
    }
  } catch (e) {
    restful = Restful.initWithError(e);
  }
  return restful;
};

/**
 * 注销
 * @param { string } account
 * @param { string } password
 */
const withDraw = async (account: string, password: string) => {
  let restful: Restful;
  try {
    const res: Array<any> = await Action.Retrieve(account);
    if (!res.length) {
      restful = new Restful(1, '账号不存在');
    } else {
      if (res[0].power > 0) {
        restful = new Restful(3, '不可删除超级管理员账号！');
      } else if (crypto(password) === res[0].password) {
        // 匹配密码
        restful = new Restful(0, '注销成功');
      } else {
        restful = new Restful(2, '密码错误');
      }
    }
  } catch (e) {
    restful = Restful.initWithError(e);
  }
  return restful;
};

export default {
  Create__Init,
  Create,
  Login,
  Retrieve,
  Retrieve__All,
  Update,
  withDraw
};
