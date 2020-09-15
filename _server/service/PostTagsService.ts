import { PostTagsAction } from '@action';
import { PostTags } from '@vo';
import { Restful } from '@public';

/**
 * 新建帖子标签
 * @param { PostTags } postTag
 */
const Create = async (postTag: PostTags) => {
  try {
    await PostTagsAction.Create(postTag);
    return new Restful(0, '新建帖子标签成功');
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

// /**
//  * 通过ID查找帖子标签
//  * @param { number } id
//  */
// const Retrieve__ByID = async (id: number) => {
//   try {
//     const res: Array<any> = await PostTagsAction.Retrieve__ByID(id);
//     if (!res.length) {
//       return new Restful(1, '帖子标签不存在');
//     }
//     return new Restful(0, '查询成功', res[0]);
//   } catch (e) {
//     console.log(e.stack);
//     throw new Error(e.message);
//   }
// };

/**
 * 通过标签名模糊查找帖子（分页）
 * @param { string } name
 * @param { number } page
 * @param { number } capacity
 */
const Retrieve__ByTagName = async (name: string, page: number, capacity: number) => {
  try {
    const res: Array<any> = await PostTagsAction.Retrieve__ByTagName(name, page, capacity);
    if (!res.length) {
      return new Restful(1, '帖子标签不存在');
    }
    return new Restful(0, '查询成功', res[0]);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 编辑帖子标签
 * @param { PostTags } postTags
 */
const Edit = async (postTags: PostTags) => {
  try {
    const res: Array<any> = await PostTagsAction.Retrieve__ByID(postTags.id);
    if (!res.length) {
      return new Restful(1, '帖子不存在');
    }
    const newPostTags: PostTags = await PostTagsAction.Update(res[0], postTags);
    return new Restful(0, '编辑成功', newPostTags);
  } catch (e) {
    console.log(e.stack);
    throw new Error(e.message);
  }
};

/**
 * 删除帖子标签
 * @param { number } id
 */
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
  // Retrieve__ByID,
  Retrieve__ByTagName,
  Edit,
  Delete
};
