import { PostTagsAction } from '@action';
import { PostTags } from '@vo';
import { Restful } from '@public';

/**
 * 新建帖子分类
 * @param { PostTags } postTag
 */
const Create = async (postTag: PostTags) => {
  try {
    const res: Array<any> = await PostTagsAction.Create(postTag);
    return new Restful(0, '新建帖子分类成功');
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 通过ID查找帖子分类
 * @param { number } id
 */
const Retrieve__ByID = async (id: number) => {
  try {
    const res: Array<any> = await PostTagsAction.Retrieve__ByID(id);
    if (!res.length) {
      return new Restful(1, '帖子分类不存在');
    }
    return new Restful(0, '查询成功', res[0]);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 通过分类名模糊查找帖子分类
 * @param { string } name
 */
const Retrieve__ByName = async (name: string) => {
  try {
    const res: Array<any> = await PostTagsAction.Retrieve__ByName(name);
    if (!res.length) {
      return new Restful(1, '帖子分类不存在');
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
    const res: Array<any> = await PostTagsAction.Retrieve__Page(page, capacity);
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
    const res: Array<any> = await PostTagsAction.Retrieve__Fuzzy(content);
    return new Restful(0, '查询成功', res);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

const Edit = async (PostTags: PostTags) => {
  try {
    const res: Array<any> = await PostTagsAction.Retrieve__ByID(PostTags.id);
    if (!res.length) {
      return new Restful(1, '帖子不存在');
    }
    const newPostTags: PostTags = await PostTagsAction.Update(res[0], PostTags);
    return new Restful(0, '编辑成功', newPostTags);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

const Delete = async (id: number) => {
  try {
    const res: Array<any> = await PostTagsAction.Retrieve__ByID(id);
    if (!res.length) {
      return new Restful(1, '帖子不存在');
    }
    await PostTagsAction.Delete(id);
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
