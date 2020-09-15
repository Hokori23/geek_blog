import { PostTags } from '@vo';
import { assign } from '@public';
import DB from '@database';

/**
 * 添加帖子分类
 * @param { PostTags } postTag
 */
const Create = (postTag: PostTags): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT INTO post_tags
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = postTag.toArray();
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
 * 通过ID查询单个帖子分类
 * @param { number } id
 */
const Retrieve__ByID = (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      SELECT * FROM post_tags WHERE id = ?
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
 * 通过分类名模糊查询单个帖子分类
 * @param { string } name
 */
const Retrieve__ByName = (name: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      SELECT * FROM post_tags WHERE name LIKE '%?%'
    `;
    const db = await DB();
    db.query(sql, [name], (err: Error, res: Array<any>) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
    db.end();
  });
};

/**
 * 遍历帖子分类
 */
const Retrieve__All = (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let sql = `
      SELECT * FROM post_tags
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
 * 更新帖子分类
 * @param { PostTags } oldPostTag
 * @param { PostTags } newPostTag
 */
const Update = (oldPostTag: PostTags, newPostTag: PostTags): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let sql = `
      UPDATE post_tags SET
          `;

    // 拼接SQL语句
    const keys = Object.keys(oldPostTag);
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
    // 混合贴子分类信息
    newPostTag = PostTags.clone(assign([oldPostTag, newPostTag], true));
    const {
      id,
      post_id,
      name,
      description,
      parent_id,
      icon_display,
      icon_class,
      icon_color,
      slug
    } = newPostTag;
    const params = [
      post_id,
      name,
      description,
      parent_id,
      icon_display,
      icon_class,
      icon_color,
      slug,
      id
    ];
    const db = await DB();
    db.query(sql, params, (err: Error, res: Array<any>) => {
      if (err) {
        reject(err);
      }
      resolve(newPostTag);
    });
    db.end();
  });
};

/**
 * 删除帖子分类
 * @param { number } id
 */
const Delete = (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    DELETE FROM post_tags WHERE id = ?
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
  Retrieve__ByName,
  Retrieve__All,
  Update,
  Delete
};
