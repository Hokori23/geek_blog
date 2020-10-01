import { PostTagAction } from '@action';
import { PostTag } from '@vo';
import { Restful, isUndef } from '@public';

/**
 * 新建帖子标签
 * @param { PostTag } postTag
 * @param { number } userPower
 */
const Create = async (
  postTag: PostTag,
  userPower: number
): Promise<Restful> => {
  try {
    if (isUndef(userPower) || userPower > 1) {
      return new Restful(1, `创建失败, 权限不足`);
    }
    postTag = await PostTagAction.Create(postTag);
    return new Restful(0, '创建成功', postTag.toJSON());
  } catch (e) {
    return new Restful(99, `创建失败, ${e.message}`);
  }
};

/**
 * 通过标签名查找帖子（分页）
 * @param { string } tag_name
 * @param { number } page
 * @param { number } capacity
 */
const Retrieve__ByTagName = async (
  tag_name: string,
  page: number,
  capacity: number
): Promise<Restful> => {
  try {
    const existedPostTag = await PostTagAction.Retrieve__ByTagNameInPage(
      tag_name,
      (page - 1) * capacity,
      Number(capacity)
    );
    if (!existedPostTag) {
      return new Restful(1, '标签不存在');
    }
    if (!existedPostTag.Posts) {
      return new Restful(0, '查询成功', []);
    }
    return new Restful(
      0,
      '查询成功',
      existedPostTag.Posts.map((post) => {
        return post.toJSON();
      })
    );
  } catch (e) {
    return new Restful(99, `查询失败, ${e.message}`);
  }
};

/**
 * 编辑帖子标签
 * @param { PostTag } PostTag
 * @param { number } userPower
 */
const Edit = async (postTag: PostTag, userPower: number) => {
  try {
    if (isUndef(userPower) || userPower > 1) {
      return new Restful(1, `编辑失败, 权限不足`);
    }
    const existedPostTag = await PostTagAction.Retrieve__ByID(
      <number>postTag.id
    );
    if (!existedPostTag) {
      return new Restful(1, '帖子不存在');
    }
    const newPostTag: PostTag = await PostTagAction.Update(
      existedPostTag,
      postTag
    );
    return new Restful(0, '编辑成功', newPostTag.toJSON());
  } catch (e) {
    return new Restful(99, `编辑成功, ${e.message}`);
  }
};

/**
 * 删除帖子标签
 * @param { number } id
 * @param { number } userPower
 */
const Delete = async (id: number, userPower: number) => {
  try {
    if (isUndef(userPower) || userPower > 1) {
      return new Restful(2, `删除失败, 权限不足`);
    }
    const existedPostTag = await PostTagAction.Retrieve__ByID(id);
    if (!existedPostTag) {
      return new Restful(1, '标签不存在');
    }
    const deleteRow = await PostTagAction.Delete(id);
    return deleteRow > 0
      ? new Restful(0, '删除成功')
      : new Restful(3, '删除失败');
  } catch (e) {
    return new Restful(99, `删除失败, ${e.message}`);
  }
};

export default {
  Create,
  Retrieve__ByTagName,
  Edit,
  Delete
};
