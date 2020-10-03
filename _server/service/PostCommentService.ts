import { PostCommentAction as Action, PostAction } from '@action';
import { PostComment } from '@vo';
import { Restful, isUndef } from '@public';

/**
 * 添加帖子评论
 * @param { Object } postComment
 */
const Create = async (postComment): Promise<Restful> => {
  try {
    const post = await PostAction.Retrieve__ByID(postComment.post_id);
    if (!post) {
      return new Restful(1, '帖子不存在');
    }
    if (
      postComment.parent_id &&
      !post.PostComments.some(
        (existedPostComment) => existedPostComment.id === postComment.parent_id
      )
    ) {
      return new Restful(2, '回复评论不存在');
    }
    postComment = await post.createPostComment(postComment);
    return new Restful(0, '创建成功', postComment.toJSON());
  } catch (e) {
    return new Restful(99, `创建失败, ${e.message}`);
  }
};

/**
 * 处理父子评论
 */
const FormatPostComments = (postComments: Array<PostComment>): Array<any> => {
  const res: Array<any> = [];
  const childComments = postComments.filter((postComment) => {
    if (!postComment.parent_id) {
      res.push({ ...postComment.toJSON(), childComments: [] });
      return false;
    }
    return true;
  });
  childComments.forEach((childComment) => {
    res.forEach((parentComments) => {
      if (childComment.parent_id === parentComments.id) {
        parentComments.childComments.push(childComment);
      }
    });
  });
  return res;
};

/**
 * 通过帖子ID查询所有评论
 * @param { number } post_id
 */
const Retrieve__ByPostID = async (post_id: number): Promise<Restful> => {
  try {
    const post = await PostAction.Retrieve__ByID(post_id);
    if (!post) {
      return new Restful(1, '帖子不存在');
    }
    return new Restful(
      0,
      '查询成功',
      FormatPostComments(
        await post.getPostComments({
          order: [['createdAt', 'ASC']]
        })
      )
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
    const existedComment = await Action.Retrieve__ByID(id);
    if (!existedComment) {
      return new Restful(1, '评论不存在');
    }
    const deleteRow = await Action.Delete(id);
    return deleteRow > 0
      ? new Restful(0, '删除成功')
      : new Restful(3, '删除失败');
  } catch (e) {
    return new Restful(99, `删除失败, ${e.message}`);
  }
};

export default {
  Create,
  Retrieve__ByPostID,
  Delete
};
