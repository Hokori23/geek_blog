import { User } from '@vo';

/**
 * 添加用户
 * @param { User } user
 */
const Create = (user: User): Promise<User> => {
  return User.create(user);
};

/**
 * 查询单个用户
 * @param { string } account
 */
const Retrieve = (account: string): Promise<User | null> => {
  return User.findOne({
    where: {
      account
    }
  });
};

/**
 * 查询单个用户（不含密码）
 * @param { string } account
 */
const Retrieve__Safely = (account: string): Promise<User | null> => {
  return User.findOne({
    attributes: {
      exclude: ['password']
    },
    where: {
      account
    }
  });
};

/**
 * 遍历用户（不含密码）
 */
const Retrieve__All__Safely = (): Promise<Array<User>> => {
  return User.findAll({
    attributes: {
      exclude: ['password']
    }
  });
};

/**
 * 更新用户信息
 * @param { User } oldUser
 * @param { User } newUser
 */
const Update = (oldUser: User, newUser: User): Promise<any> => {
  return Object.assign(oldUser, newUser).save();
};

/**
 * 删除用户账号
 * @param { string } account
 */
const Delete = (account: string): Promise<any> => {
  return User.destroy({
    where: {
      account
    }
  });
};

export default {
  Create,
  Retrieve,
  Retrieve__Safely,
  Retrieve__All__Safely,
  Update,
  Delete
};
