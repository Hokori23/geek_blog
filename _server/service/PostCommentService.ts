import { PostCommentAction as Action, PostAction } from '@action';
import { MailAccepterService } from '@service';
import { Post, PostComment } from '@vo';
import { Restful, isUndef } from '@public';
import DB from '@database';

/**
 * 添加帖子评论
 * @param { Object } postComment
 */
const Create = async (postComment): Promise<Restful> => {
  const t = await DB.transaction();
  try {
    const post = await PostAction.Retrieve__ByID(postComment.post_id, true, t);
    if (!post) {
      return new Restful(1, '帖子不存在');
    }
    const hasParentComment = postComment.parent_id;
    if (
      postComment.parent_id &&
      !post.PostComments.some(
        (existedPostComment) => existedPostComment.id === postComment.parent_id
      )
    ) {
      return new Restful(2, '回复评论不存在');
    }

    // 添加帖子评论
    const promises: Array<Promise<any>> = [
      post.createPostComment(postComment, { transaction: t }),
      PostAction.CommentCountChange(post, true, t)
    ];

    const promiseValues = await Promise.all(promises);
    postComment = promiseValues[0];
    if (hasParentComment) {
      MailAccepterService.Broadcast__WhenReply(post, postComment);
    }

    await t.commit();
    return new Restful(0, '创建成功', postComment.toJSON());
  } catch (e) {
    await t.rollback();
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
    const postComments = await post.getPostComments({
      order: [['createdAt', 'ASC']]
    });
    return new Restful(0, '查询成功', FormatPostComments(postComments));
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
  const t = await DB.transaction();
  try {
    if (isUndef(userPower) || userPower > 1) {
      return new Restful(2, `删除失败, 权限不足`);
    }
    const existedComment = await Action.Retrieve__ByID(id, t);
    if (!existedComment) {
      return new Restful(1, '评论不存在');
    }
    const commentCountDecrement = new Promise(async (resolve) => {
      const existedPost = await PostAction.Retrieve__ByID(
        existedComment.post_id
      );
      if (!existedPost) {
        resolve(new Restful(4, '帖子不存在'));
      }
      resolve(await PostAction.CommentCountChange(<Post>existedPost, false, t));
    });

    const promises: Array<Promise<any>> = [
      Action.Delete(id, t),
      commentCountDecrement
    ];
    const promisesValue = await Promise.all(promises);
    const deleteRow = promisesValue[0];

    return deleteRow > 0
      ? new Restful(0, '删除成功') && t.commit()
      : new Restful(3, '删除失败') && t.rollback();
  } catch (e) {
    await t.rollback();
    return new Restful(99, `删除失败, ${e.message}`);
  }
};

export default {
  Create,
  Retrieve__ByPostID,
  Delete
};
