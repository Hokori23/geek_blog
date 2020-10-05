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
 * 通过评论ID查询评论的子评论
 * @param { number } parent_id
 */
const Retrieve__ChildrenComments__ByID = (
  parent_id: number
): Promise<Array<PostComment>> => {
  return PostComment.findAll({
    where: {
      parent_id
    }
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
  Retrieve__ChildrenComments__ByID,
  Delete
};
