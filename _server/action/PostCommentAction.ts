import { PostComment } from '@vo';

/**
 * 添加帖子评论
 * @param { PostComment } postComment
 */
const Create = (postComment: PostComment): Promise<PostComment> => {
  return postComment.save();
};

/**
 * 通过评论ID查询评论
 * @param { number } id
 */
const Retrieve__ByID = (id: number): Promise<Array<PostComment>> => {
  return PostComment.findAll({
    where: {
      id
    }
  });
};

/**
 * 通过帖子ID查询所有评论
 * @param { number } post_id
 */
const Retrieve__ByPostID = (post_id: number): Promise<Array<PostComment>> => {
  return PostComment.findAll({
    where: {
      post_id
    }
  });
};

/**
 * 通过评论ID删除评论
 * @param { number } id
 */
const Delete = (id: number): Promise<number> => {
  return PostComment.destroy({
    where: {
      id
    }
  });
};
export default {
  Create,
  Retrieve__ByID,
  Retrieve__ByPostID,
  Delete
};
