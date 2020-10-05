import { PostComment } from '@vo';
import { Transaction } from 'sequelize/types';

/**
 * 通过评论ID查询评论
 * @param { number } id
 * @param { Transaction } ?t
 */
const Retrieve__ByID = (
  id: number,
  t?: Transaction
): Promise<PostComment | null> => {
  return PostComment.findOne({
    where: {
      id
    },
    transaction: t
  });
};

/**
 * 通过评论ID删除评论
 * @param { number } id
 * @param { Transaction } ?t
 */
const Delete = (id: number, t?: Transaction): Promise<number> => {
  return PostComment.destroy({
    where: {
      id
    },
    transaction: t
  });
};

export default {
  Retrieve__ByID,
  Delete
};
