import { User } from '../vo';

/**
 * 添加用户
 * @param { User } user
 */
const Add_User = (user: User): Promise<{}> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT INTO user
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = user.toArray();
    const db = await DB();
    db.query(sql, params, (err: Error, res: Response) => {
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
const Retrieve_User = (account: string): Promise<{}> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      SELECT * FROM user WHERE account = ?
    `;
    const db = await DB();
    db.query(sql, [account], (err: Error, res: Response) => {
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
const Retrieve_User_Safely = (account: string): Promise<{}> => {
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
        sql += `
        ${v}${index === keysLength ? '' : ','}
        `;
      }
    });
    sql += `
      WHERE account = ?
    `;
    const db = await DB();
    db.query(sql, [account], (err: Error, res: Response) => {
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
const Update_User = (oldUser: User, newUser: User): Promise<{}> => {
  return new Promise(async (resolve, reject) => {
    let sql = `
      UPDATE user SET
    `;

    // 拼接SQL语句
    const keys = Object.keys(oldUser);
    const keysLength = keys.length;
    keys.forEach((v, index) => {
      sql += `
      ${v} = ?${index === keysLength ? '' : '?'}
      `;
    });
    sql += `
      WHERE account = ?
    `;

    // 混合用户信息
    newUser = _PUBLIC.assign([oldUser, newUser], true);
    const params = newUser.toArray().push(newUser.account);
    const db = await DB();
    db.query(sql, params, (err: Error, res: Response) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
    db.end();
  });
};

/**
 * 删除用户账号
 * @param { string} account
 */
const Delete_User = (account: string): Promise<{}> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    DELETE FROM user WHERE account = ?
  `;
    const db = await DB();
    db.query(sql, [account], (err: Error, res: Response) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
    db.end();
  });
};


export {
  Add_User,
  Retrieve_User,
  Retrieve_User_Safely,
  Update_User,
  Delete_User
};
