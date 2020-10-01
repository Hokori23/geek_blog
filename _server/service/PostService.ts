import { PostAction, PostTagAction } from '@action';
import { Post, PostTag } from '@vo';
import { Restful, isUndef } from '@public';
import DB from '@database';

/**
 * 发布帖子
 * @param { Post } post
 * @param { string } post_tag_name
 * @param { number } userPower
 * @param { string } userAccount
 */
const Create = async (
  post: Post,
  post_tag_names: Array<string>,
  userPower: number,
  userAccount: string
): Promise<Restful> => {
  const t = await DB.transaction();
  try {
    if (isUndef(userPower) || userPower > 1) {
      return new Restful(1, `创建失败, 权限不足`);
    }
    post.user_account = userAccount;

    let promises: Array<Promise<any>> = [];

    post_tag_names.forEach((tag_name) => {
      promises.push(PostTagAction.Retrieve__ByTagName(tag_name));
    });
    promises.push(PostAction.Create(post, t));
    const promiseValues = await Promise.all(promises);
    post = promiseValues.pop();
    const postTags = promiseValues;

    promises = [];
    postTags.forEach((postTag, idx) => {
      if (!postTag) {
        throw new Error(`${post_tag_names[idx]}标签不存在`);
      }
      promises.push(post.addPostTag(postTag, { transaction: t }));
    });
    await Promise.all(promises);
    t.commit();
    post = (await PostAction.Retrieve__ByID(<number>post.id)) as Post;
    return new Restful(0, '创建成功', post.toJSON());
  } catch (e) {
    await t.rollback();
    return new Restful(99, `创建失败, ${e.message}`);
  }
};

/**
 * 通过ID查找帖子
 * @param { number } id
 * @param { boolean } withComments
 */
const Retrieve__ByID = async (
  id: number,
  withComments: boolean = true
): Promise<Restful> => {
  try {
    const existedPost = await PostAction.Retrieve__ByID(id, withComments);
    if (!existedPost) {
      return new Restful(1, '帖子不存在');
    }
    return new Restful(0, '查询成功', existedPost.toJSON());
  } catch (e) {
    return new Restful(99, `查询失败, ${e.message}`);
  }
};

/**
 * 分页查询帖子
 * @param { number } page
 * @param { number } capacity
 * @param { boolean } withComments
 * @param { boolean } isASC
 */
const Retrieve__Page = async (
  page: number,
  capacity: number,
  withComments: boolean = true,
  isASC: boolean = false
): Promise<Restful> => {
  try {
    const existedPosts = await PostAction.Retrieve__Page(
      (page - 1) * capacity,
      Number(capacity),
      withComments,
      isASC
    );
    return new Restful(
      0,
      '查询成功',
      existedPosts.map((post) => {
        return post.toJSON();
      })
    );
  } catch (e) {
    return new Restful(99, `查询失败, ${e.message}`);
  }
};

/**
 * 分页模糊查询帖子
 * @param { number } page
 * @param { number } capacity
 * @param { string } content
 * @param { boolean } withComments
 * @param { boolean } isASC
 */
const Retrieve__Fuzzy = async (
  page: number,
  capacity: number,
  content: string,
  withComments: boolean = true,
  isASC: boolean = false
): Promise<Restful> => {
  try {
    const existedPosts = await PostAction.Retrieve__Fuzzy(
      (page - 1) * capacity,
      Number(capacity),
      content,
      withComments,
      isASC
    );
    return new Restful(
      0,
      '查询成功',
      existedPosts.map((post) => {
        return post.toJSON();
      })
    );
  } catch (e) {
    return new Restful(99, `查询失败, ${e.message}`);
  }
};

/**
 * 编辑帖子
 * @param { Post } post
 * @param { number } userPower
 * @param { string } userAccount
 */
const Edit = async (post: Post, userPower: number, userAccount: string) => {
  try {
    if (isUndef(userPower) || userPower > 1) {
      return new Restful(1, `编辑失败, 权限不足`);
    }
    const existedPost = await PostAction.Retrieve__ByID(<number>post.id);
    if (!existedPost) {
      return new Restful(2, '帖子不存在');
    }

    // 混合属性
    post.user_account = userAccount;
    const newPost = await PostAction.Update(existedPost, post);
    return new Restful(0, '编辑成功', newPost.toJSON());
  } catch (e) {
    return new Restful(99, `编辑失败, ${e.message}`);
  }
};

/**
 * 删除帖子
 * @param { number } id
 * @param { number } userPower
 */
const Delete = async (id: number, userPower: number) => {
  try {
    if (isUndef(userPower) || userPower > 1) {
      return new Restful(2, `删除失败, 权限不足`);
    }
    const existedPost = await PostAction.Retrieve__ByID(id);
    if (!existedPost) {
      return new Restful(1, '帖子不存在');
    }
    const deleteRow = await PostAction.Delete(id);
    return deleteRow > 0
      ? new Restful(0, '删除成功')
      : new Restful(3, '删除失败');
  } catch (e) {
    return new Restful(99, `删除失败, ${e.message}`);
  }
};

export default {
  Create,
  Retrieve__ByID,
  Retrieve__Page,
  Retrieve__Fuzzy,
  Edit,
  Delete
};
