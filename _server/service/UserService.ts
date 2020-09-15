import { UserAction as Action } from '@action';
import { User } from '@vo';
import { Restful, crypto, timeFormat } from '@public';

/**
 * 初始化超级管理员
 * @param { User } user
 */
const Create__SuperAdmin = async (user: User) => {
  try {
    let res: Array<any> = await Action.Retrieve__All__Safely();
    if (res.length) {
      return new Restful(
        1,
        '已有其它用户存在，不可创建新的超级管理员账号，请登录数据库检查或重新创建数据库'
      );
    }

    // 加密密码
    user.password = crypto(<string>user.password);

    /**
     * 1. 权限0: 超级管理员
     * 2. 去除ID
     * 3. 添加last_activated_at字段
     */
    user.power = 0;
    user.id = undefined;
    user.last_activated_at = timeFormat();

    res = await Action.Create(user);
    if (res.length) {
      return new Restful(2, '账号已存在');
    }
    // 脱敏
    delete res[0].password;
    return new Restful(0, '添加超级管理员成功', res[0]);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 添加管理员
 * @param { User } user
 */
const Create__Admin = async (user: User) => {
  try {
    let res: Array<any> = await Action.Retrieve(<string>user.account);
    if (res.length) {
      return new Restful(1, '账号已存在');
    }
    // 加密密码
    user.password = crypto(<string>user.password);

    /**
     * 1. 权限1: 管理员
     * 2. 去除ID
     * 3. 添加last_activated_at字段
     */
    user.power = 1;
    user.id = undefined;
    user.last_activated_at = timeFormat();

    res = await Action.Create(user);
    // 脱敏
    delete user.password;
    return new Restful(0, '添加管理员成功', user);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 添加普通账号
 * @param { User } user
 */
const Create = async (user: User) => {
  try {
    let res: Array<any> = await Action.Retrieve(<string>user.account);
    if (res.length) {
      return new Restful(1, '账号已存在');
    }
    if (<number>user.power <= 1) {
      return new Restful(2, '你无权限创建此类账号');
    }
    // 加密密码
    user.password = crypto(<string>user.password);

    /**
     * 1. 去除ID
     * 2. 添加last_activated_at字段
     */
    user.last_activated_at = timeFormat();
    user.id = undefined;

    res = await Action.Create(user);
    // 脱敏
    delete user.password;
    return new Restful(0, '注册成功', user);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 登录
 * @param { User } user
 */
const Login = async (user: User) => {
  const { account, password } = user;
  try {
    const res: Array<any> = await Action.Retrieve(<string>account);
    if (!res.length) {
      return new Restful(1, '账号不存在');
    }
    // 匹配密码
    if (crypto(<string>password) === res[0].password) {
      // 脱敏
      delete res[0].password;
      return new Restful(0, '登陆成功', res[0]);
    }
    return new Restful(2, '账号或密码错误');
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 查询单个用户
 * @param { string } account
 */
const Retrieve = async (account: string) => {
  try {
    const res: Array<any> = await Action.Retrieve__Safely(account);
    if (!res.length) {
      return new Restful(1, '账号不存在');
    }
    return new Restful(0, '查询成功', res[0]);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 遍历用户
 */
const Retrieve__All = async () => {
  try {
    const res: Array<any> = await Action.Retrieve__All__Safely();
    return new Restful(0, '查询成功', res);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 编辑用户
 * @param { User }user
 */
const Edit = async (user: User) => {
  try {
    let res: Array<any> = await Action.Retrieve(<string>user.account);
    if (!res.length) {
      return new Restful(1, '账号不存在');
    }
    const newUser: User = await Action.Update(res[0], user);
    // 脱敏
    delete newUser.password;
    return new Restful(0, '编辑成功', newUser);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 编辑用户（包含修改密码）
 * @param { User }user
 */
const EditIncludePassword = async (user: User, old_password) => {
  try {
    let res: Array<any> = await Action.Retrieve(<string>user.account);
    if (!res.length) {
      return new Restful(1, '账号不存在');
    }
    if (crypto(<string>old_password) === res[0].password) {
      user.password = crypto(<string>user.password);
      let newUser: User = await Action.Update(res[0], user);
      // 脱敏
      delete newUser.password;
      return new Restful(0, '编辑成功', newUser);
    }
    return new Restful(2, '密码错误');
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 注销
 * @param { string } operateAccount 操作账号
 * @param { string } account 注销账号
 * @param { string } password
 */
const Delete = async (
  operateAccount: string,
  account: string,
  password: string
) => {
  try {
    const operateUser: Array<any> = await Action.Retrieve(operateAccount);
    const deleteUser: Array<any> = await Action.Retrieve(account);
    if (!deleteUser.length) {
      return new Restful(1, '账号不存在');
    }
    if (operateAccount !== account) {
      if (
        operateUser[0].power > 1 ||
        operateUser[0].power >= deleteUser[0].power
      ) {
        return new Restful(3, '你无权删除他人的账号！');
      }
    }
    if (crypto(password) === operateUser[0].password) {
      // 匹配密码
      return new Restful(0, '注销成功');
    }
    return new Restful(2, '密码错误');
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

export default {
  Create__SuperAdmin,
  Create__Admin,
  Create,
  Login,
  Retrieve,
  Retrieve__All,
  Edit,
  EditIncludePassword,
  Delete
};
