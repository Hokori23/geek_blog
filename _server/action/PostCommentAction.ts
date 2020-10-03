import { PostComment } from '@vo';

/**
 * 通过评论ID查询评论
 * @param { number } id
 */
const Retrieve__ByID = (id: number): Promise<PostComment | null> => {
  return PostComment.findOne({
    where: {
      id
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
  Retrieve__ByID,
  Delete
};
