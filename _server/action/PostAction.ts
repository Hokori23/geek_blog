import { Post } from '@vo';
import { assign, timeFormat } from '@public';
import DB from '@database';

/**
 * 添加帖子
 * @param { Post } post
 */
const Create = (post: Post): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT INTO post
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = post.toArray();
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
 * 通过ID查询单个帖子
 * @param { number } id
 */
const Retrieve__ByID = (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      SELECT * FROM post WHERE id = ?
    `;
    const db = await DB();
    db.query(sql, [id], (err: Error, res: Array<any>) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
    db.end();
  });
};

/**
 * 查询某页帖子
 * @param { number } page
 * @param { number } capacity
 */
const Retrieve__Page = (page: number, capacity: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      SELECT * FROM post LIMIT ?, ?
    `;
    const db = await DB();
    db.query(sql, [page, capacity], (err: Error, res: Array<any>) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
    db.end();
  });
};

/**
 * 模糊查询帖子
 * @param { string } content
 */
const Retrieve__Fuzzy = (content: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      SELECT * FROM post
      WHERE content LIKE '%?%' ORDER BY created_at DESC
    `;
    const db = await DB();
    db.query(sql, [content], (err: Error, res: Array<any>) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
    db.end();
  });
};

/**
 * 更新帖子
 * @param { Post } oldPost
 * @param { Post } newPost
 */
const Update = (oldPost: Post, newPost: Post): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let sql = `
      UPDATE post SET
          `;

    // 拼接SQL语句
    const keys = Object.keys(oldPost);
    const keysLength = keys.length;
    keys.forEach((v, index) => {
      if (v !== 'id') {
        sql += `\`${v}\` = ?`;
        if (index !== keysLength - 1) {
          sql += `,
          `;
        }
      }
    });
    sql += `
      WHERE id = ?
    `;
    // 强制设置编辑时间
    oldPost.last_modified_at = timeFormat(Date.now())
    // 混合帖子信息
    newPost = Post.clone(assign([oldPost, newPost], true));
    const {
      id,
      content,
      created_at,
      view_count,
      comment_count,
      is_hidden,
      is_locked,
      is_sticky,
      type,
      title,
      cover_url,
      last_modified_at,
      tag
    } = newPost;
    const params = [
      title,
      content,
      cover_url,
      created_at,
      last_modified_at,
      view_count,
      comment_count,
      is_hidden,
      is_locked,
      is_sticky,
      tag,
      type,
      id
    ];
    const db = await DB();
    db.query(sql, params, (err: Error, res: Array<any>) => {
      if (err) {
        reject(err);
      }
      resolve(newPost);
    });
    db.end();
  });
};

/**
 * 删除帖子
 * @param { number } id
 */
const Delete = (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    DELETE FROM post WHERE id = ?
  `;
    const db = await DB();
    db.query(sql, [id], (err: Error, res: Array<any>) => {
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
  Retrieve__ByID,
  Retrieve__Page,
  Retrieve__Fuzzy,
  Update,
  Delete
};
