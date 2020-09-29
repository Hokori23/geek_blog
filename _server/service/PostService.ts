import { PostAction } from '@action';
import { Post } from '@vo';
import { Restful, isUndef } from '@public';

/**
 * 发布帖子
 * @param { Post } post
 * @param { number } userPower
 * @param { string } userAccount
 */
const Create = async (
  post: Post,
  userPower: number,
  userAccount: string
): Promise<Restful> => {
  try {
    if (isUndef(userPower) || userPower > 1) {
      return new Restful(1, `创建失败, 权限不足`);
    }
    post.user_account = userAccount;
    post = await PostAction.Create(post);
    return new Restful(0, '创建成功', post.toJSON());
  } catch (e) {
    return new Restful(99, `创建失败, ${e.message}`);
  }
};

/**
 * 通过ID查找帖子
 * @param { number } id
 */
const Retrieve__ByID = async (id: number): Promise<Restful> => {
  try {
    const existedPost = await PostAction.Retrieve__ByID(id);
    if (!existedPost) {
      return new Restful(1, '帖子不存在');
    }
    return new Restful(0, '查询成功', existedPost);
  } catch (e) {
    return new Restful(99, `查询失败, ${e.message}`);
  }
};

/**
 * 分页查询帖子
 * @param { number } page
 * @param { number } capacity
 * @param { boolean } isASC
 */
const Retrieve__Page = async (
  page: number,
  capacity: number,
  isASC: boolean = false
): Promise<Restful> => {
  try {
    const existedPosts = await PostAction.Retrieve__Page(
      (page - 1) * capacity,
      Number(capacity),
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
 * @param { boolean } isASC
 */
const Retrieve__Fuzzy = async (
  page: number,
  capacity: number,
  content: string,
  isASC: boolean = false
): Promise<Restful> => {
  try {
    const existedPosts = await PostAction.Retrieve__Fuzzy(
      (page - 1) * capacity,
      Number(capacity),
      content,
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
    if (deleteRow > 0) {
      return new Restful(0, '删除成功');
    } else {
      return new Restful(3, '删除失败');
    }
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
