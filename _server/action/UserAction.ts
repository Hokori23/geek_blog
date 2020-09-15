import { User } from '@vo';
import { assign } from '@public';
import DB from '@database';

/**
 * 添加用户
 * @param { User } user
 */
const Create = (user: User): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT INTO user
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = user.toArray();
    const db = await DB();
    db.query(sql, params, (err: Error, res: Array<any>) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
    db.end();
  });
};

/**
 * 查询单个用户
 * @param { string } account
 */
const Retrieve = (account: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      SELECT * FROM user WHERE account = ?
    `;
    const db = await DB();
    db.query(sql, [account], (err: Error, res: Array<any>) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
    db.end();
  });
};

/**
 * 查询单个用户（不含密码）
 * @param { string } account
 */
const Retrieve__Safely = (account: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let sql = `
      SELECT
          `;

    // 拼接SQL语句
    const tempUser: User = new User();
    const keys = Object.keys(tempUser);
    const keysLength = keys.length;
    keys.forEach((v, index) => {
      if (v !== 'password') {
        sql += `\`${v}\``;
        if (index !== keysLength - 1) {
          sql += `,
          `;
        }
      }
    });
    sql += `
      FROM user
      WHERE account = ?
    `;
    const db = await DB();
    db.query(sql, [account], (err: Error, res: Array<any>) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
    db.end();
  });
};

/**
 * 遍历用户（不含密码）
 */
const Retrieve__All__Safely = (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let sql = `
      SELECT
          `;

    // 拼接SQL语句
    const tempUser: User = new User();
    const keys = Object.keys(tempUser);
    const keysLength = keys.length;
    keys.forEach((v, index) => {
      if (v !== 'password') {
        sql += `\`${v}\``;
        if (index !== keysLength - 1) {
          sql += `,
          `;
        }
      }
    });
    sql += `
      FROM user
    `;
    const db = await DB();
    db.query(sql, (err: Error, res: Array<any>) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
    db.end();
  });
};

/**
 * 更新用户信息
 * @param { User } oldUser
 * @param { User } newUser
 */
const Update = (oldUser: User, newUser: User): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let sql = `
      UPDATE user SET
          `;

    // 拼接SQL语句
    const keys = Object.keys(oldUser);
    const keysLength = keys.length;
    keys.forEach((v, index) => {
      if (v !== 'id' && v !== 'account' && v !== 'power') {
        sql += `\`${v}\` = ?`;
        if (index !== keysLength - 1) {
          sql += `,
          `;
        }
      }
    });
    sql += `
      WHERE account = ?
    `;
    // 混合用户信息
    newUser = User.clone(assign([oldUser, newUser], true));
    const {
      username,
      email,
      password,
      avatar_url,
      bio,
      social_buttons,
      last_activated_at,
      account
    } = newUser;
    const params = [
      username,
      email,
      password,
      avatar_url,
      bio,
      social_buttons,
      last_activated_at,
      account
    ];
    const db = await DB();
    db.query(sql, params, (err: Error, res: Array<any>) => {
      if (err) {
        reject(err);
      }
      resolve(newUser);
    });
    db.end();
  });
};

/**
 * 删除用户账号
 * @param { string } account
 */
const Delete = (account: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    DELETE FROM user WHERE account = ?
  `;
    const db = await DB();
    db.query(sql, [account], (err: Error, res: Array<any>) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
    db.end();
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
