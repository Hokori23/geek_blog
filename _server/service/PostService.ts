import { PostAction } from '@action';
import { Post } from '@vo';
import { Restful } from '@public';

/**
 * 发布帖子
 * @param { Post } post
 */
const Create = async (post: Post) => {
  try {
    const res: Array<any> = await PostAction.Create(post);
    return new Restful(0, '创建帖子成功');
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 通过ID查找帖子
 * @param { number } id
 */
const Retrieve__ByID = async (id: number) => {
  try {
    const res: Array<any> = await PostAction.Retrieve__ByID(id);
    if (!res.length) {
      return new Restful(1, '帖子不存在');
    }
    return new Restful(0, '查询成功', res[0]);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 分页查询帖子
 * @param { number } page
 * @param { number } capacity
 */
const Retrieve__Page = async (page: number, capacity: number) => {
  try {
    const res: Array<any> = await PostAction.Retrieve__Page(page, capacity);
    return new Restful(0, '查询成功', res[0]);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 模糊查询帖子
 * @param { string } content
 */
const Retrieve__Fuzzy = async (content: string) => {
  try {
    const res: Array<any> = await PostAction.Retrieve__Fuzzy(content);
    return new Restful(0, '查询成功', res);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 编辑帖子
 * @param { Post } post
 */
const Edit = async (post: Post) => {
  try {
    const res: Array<any> = await PostAction.Retrieve__ByID(post.id);
    if (!res.length) {
      return new Restful(1, '帖子不存在');
    }
    const newPost: Post = await PostAction.Update(res[0], post);
    return new Restful(0, '编辑成功', newPost);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 删除帖子
 * @param { number } id
 */
const Delete = async (id: number) => {
  try {
    const res: Array<any> = await PostAction.Retrieve__ByID(id);
    if (!res.length) {
      return new Restful(1, '帖子不存在');
    }
    await PostAction.Delete(id);
    return new Restful(0, '删除成功');
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
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
