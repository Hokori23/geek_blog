import { UserAction as Action } from '@action';
import { User } from '@vo';
import { Restful, crypto } from '@public';

/**
 * 初始化超级管理员
 * @param { User } user
 */
const Create__SuperAdmin = async (user: User): Promise<Restful> => {
  try {
    const existedUsers = await Action.Retrieve__All__Safely();
    if (existedUsers.length) {
      return new Restful(
        1,
        '已有其它用户存在，不可创建新的超级管理员账号，请登录数据库检查或重新创建数据库'
      );
    }

    // 加密密码
    user.password = crypto(user.password);

    /**
     * 1. 权限0: 超级管理员
     * 2. 去除ID（自增字段）
     */
    user.power = 0;
    user.id = null;

    user = await Action.Create(user);

    return new Restful(0, '添加超级管理员成功', user.toJSON());
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * 添加管理员
 * @param { User } user
 */
const Create__Admin = async (user: User): Promise<Restful> => {
  try {
    const existedUser = await Action.Retrieve(<string>user.account);
    if (existedUser) {
      return new Restful(1, '账号已存在');
    }
    // 加密密码
    user.password = crypto(<string>user.password);

    /**
     * 1. 权限1: 管理员
     * 2. 去除ID（自增字段）
     */
    user.power = 1;
    user.id = null;

    user = await Action.Create(user);

    return new Restful(0, '添加管理员成功', user.toJSON());
  } catch (e) {
    return new Restful(99, `添加管理员失败, ${e.message}`);
  }
};

/**
 * 添加普通账号
 * @param { User } user
 */
const Register = async (user: User): Promise<Restful> => {
  try {
    const existedUser = await Action.Retrieve(<string>user.account);
    if (existedUser) {
      return new Restful(1, '账号已存在');
    }
    if (<number>user.power <= 1) {
      return new Restful(2, '你无权限创建此类账号');
    }
    // 加密密码
    user.password = crypto(<string>user.password);

    // 去除ID（自增字段）
    user.id = null;

    user = await Action.Create(user);

    return new Restful(0, '注册成功', user.toJSON());
  } catch (e) {
    return new Restful(99, `注册失败, ${e.message}`);
  }
};

/**
 * 登录
 * @param { User } user
 */
const Login = async (user: User): Promise<Restful> => {
  const { account, password } = user;
  try {
    const existedUser = await Action.Retrieve(<string>account);
    if (!existedUser) {
      return new Restful(1, '账号不存在');
    }
    // 匹配密码
    if (crypto(<string>password) === user.password) {
      // 脱敏
      user.password = null;
      return new Restful(0, '登陆成功', user.toJSON());
    }
    return new Restful(2, '账号或密码错误');
  } catch (e) {
    return new Restful(99, `登陆失败, ${e.message}`);
  }
};

/**
 * 查询单个用户
 * @param { string } account
 */
const Retrieve = async (account: string): Promise<Restful> => {
  try {
    const user = await Action.Retrieve__Safely(account);
    if (!user) {
      return new Restful(1, '账号不存在');
    }
    return new Restful(0, '查询成功', user.toJSON());
  } catch (e) {
    return new Restful(99, `查询失败, ${e.message}`);
  }
};

/**
 * 遍历用户
 */
const Retrieve__All = async (): Promise<Restful> => {
  try {
    const users = await Action.Retrieve__All__Safely();
    return new Restful(0, '查询成功', users);
  } catch (e) {
    return new Restful(99, `查询失败, ${e.message}`);
  }
};

/**
 * 编辑用户
 * @param { User } user
 */
const Edit = async (user: User): Promise<Restful> => {
  try {
    const existedUser = await Action.Retrieve(<string>user.account);
    if (existedUser === null || existedUser === undefined) {
      return new Restful(1, '账号不存在');
    }
    const newUser = await Action.Update(existedUser, user);

    // 脱敏
    newUser.password = null;
    return new Restful(0, '编辑成功', newUser.toJSON());
  } catch (e) {
    return new Restful(99, `编辑失败, ${e.message}`);
  }
};

/**
 * 编辑用户（包含修改密码）
 * @param { User } user
 */
const EditIncludePassword = async (user: User, old_password) => {
  try {
    const existedUser = await Action.Retrieve(<string>user.account);
    if (!existedUser) {
      return new Restful(1, '账号不存在');
    }
    if (crypto(<string>old_password) === existedUser.password) {
      user.password = crypto(<string>user.password);
      const newUser: User = await Action.Update(existedUser, user);

      // 脱敏
      newUser.password = null;
      return new Restful(0, '编辑成功', newUser.toJSON());
    }
    return new Restful(2, '密码错误');
  } catch (e) {
    return new Restful(99, `编辑失败, ${e.message}`);
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
    const operateUser = await Action.Retrieve(operateAccount);
    const deleteUser = await Action.Retrieve(account);
    if (!operateUser) {
      return new Restful(2, '管理员账号不存在');
    }
    if (!deleteUser) {
      return new Restful(3, '被操作账号不存在');
    }
    if (operateAccount !== account) {
      if (operateUser.power > 1 || operateUser.power >= deleteUser.power) {
        return new Restful(1, '你无权删除他人的账号！');
      }
    }
    if (crypto(password) === operateUser.password) {
      // 匹配密码
      const deleteRow = await Action.Delete(account);
      if (deleteRow > 0) {
        return new Restful(0, '注销成功');
      } else {
        return new Restful(5, '注销失败');
      }
    }
    return new Restful(4, '密码错误');
  } catch (e) {
    return new Restful(99, '注销失败');
  }
};

export default {
  Create__SuperAdmin,
  Create__Admin,
  Register,
  Login,
  Retrieve,
  Retrieve__All,
  Edit,
  EditIncludePassword,
  Delete
};
