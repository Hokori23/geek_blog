import { PostCommentAction } from '@action';
import { PostComment, PostTag } from '@vo';
import { Restful, isUndef } from '@public';

/**
 * 添加帖子评论
 * @param { PostComment } postComment
 */
const Create = async (postComment: PostComment): Promise<Restful> => {
  try {
    postComment = await PostCommentAction.Create(postComment);
    return new Restful(0, '创建成功', postComment.toJSON());
  } catch (e) {
    return new Restful(99, `创建失败, ${e.message}`);
  }
};

/**
 * 通过帖子ID查询所有评论
 * @param { number } post_id
 */
const Retrieve__ByPostID = async (post_id: number): Promise<Restful> => {
  try {
    const postComments = await PostCommentAction.Retrieve__ByPostID(post_id);
    return new Restful(
      0,
      '查询成功',
      postComments.map((postComment) => {
        return postComment.toJSON();
      })
    );
  } catch (e) {
    return new Restful(99, `查询失败, ${e.message}`);
  }
};

/**
 * 通过评论ID删除评论
 * @param { number } id
 * @param { number } userPower
 */
const Delete = async (id: number, userPower: number) => {
  try {
    if (isUndef(userPower) || userPower > 1) {
      return new Restful(2, `删除失败, 权限不足`);
    }
    const existedComment = await PostCommentAction.Retrieve__ByID(id);
    if (!existedComment) {
      return new Restful(1, '评论不存在');
    }
    const deleteRow = await PostCommentAction.Delete(id);
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
  Retrieve__ByPostID,
  Delete
};
