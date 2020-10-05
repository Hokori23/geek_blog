import { Op, Transaction } from 'sequelize';

import { Post, PostTag, PostComment } from '@vo';

/**
 * 添加帖子
 * @param { Post } post
 * @param { Transaction } ?t
 */
const Create = (post: Post, t?: Transaction): Promise<Post> => {
  return post.save({ transaction: t });
};

/**
 * 通过ID查询单个帖子
 * @param { number } id
 * @param { boolean } withComments
 * @param { Transaction } ?t
 */
const Retrieve__ByID = (
  id: number,
  withComments: boolean = true,
  t?: Transaction
): Promise<Post | null> => {
  return Post.findOne({
    where: {
      id
    },
    include: withComments ? [PostTag, PostComment] : PostTag,
    transaction: t
  });
};

/**
 * 分页查询帖子
 * @param { number } offset
 * @param { number } limit
 * @param { boolean } withComments
 * @param { boolean } isASC
 */
const Retrieve__Page = (
  offset: number,
  limit: number,
  withComments: boolean = true,
  isASC: boolean = false
): Promise<Array<Post>> => {
  return Post.findAll({
    include: withComments ? [PostTag, PostComment] : PostTag,
    offset,
    limit,
    order: [
      ['is_sticky', 'DESC'],
      ['createdAt', isASC ? 'ASC' : 'DESC']
    ]
  });
};

/**
 * 分页模糊查询帖子
 * @param { number } offset
 * @param { number } limit
 * @param { string } content
 * @param { boolean } withComments
 * @param { boolean } isASC
 */
const Retrieve__Fuzzy = (
  offset: number,
  limit: number,
  content: string,
  withComments: boolean = true,
  isASC: boolean = false
): Promise<Array<Post>> => {
  return Post.findAll({
    where: {
      content: {
        [Op.substring]: content
      }
    },
    include: withComments ? [PostTag, PostComment] : PostTag,
    offset,
    limit,
    order: [['createdAt', isASC ? 'ASC' : 'DESC']]
  });
};

/**
 * 更新帖子
 * @param { Post } oldPost
 * @param { Post } newPost
 */
const Update = (oldPost: Post, newPost: Post): Promise<Post> => {
  return Object.assign(oldPost, newPost).save();
};

/**
 * 删除帖子
 * @param { number } id
 * @param { Transaction } ?t
 */
const Delete = (id: number, t?: Transaction): Promise<number> => {
  return Post.destroy({
    where: {
      id
    },
    transaction: t
  });
};

/**
 * 修改访问数
 * @param { Post } post
 * @param { boolean } isIncrement
 * @param { Transaction } ?t
 */
const ViewCountChange = async (
  post: Post,
  isIncrement: boolean,
  t?: Transaction
): Promise<Post> => {
  isIncrement
    ? await post.increment('view_count', { transaction: t })
    : await post.decrement('view_count', { transaction: t });
  return post.reload();
};

/**
 * 修改评论数
 * @param { Post } post
 * @param { boolean } isIncrement
 * @param { Transaction } ?t
 */
const CommentCountChange = async (
  post: Post,
  isIncrement: boolean,
  t?: Transaction
): Promise<Post> => {
  isIncrement
    ? await post.increment('comment_count', { transaction: t })
    : await post.decrement('comment_count', { transaction: t });
  return post.reload();
};

export default {
  Create,
  Retrieve__ByID,
  Retrieve__Page,
  Retrieve__Fuzzy,
  Update,
  Delete,
  ViewCountChange,
  CommentCountChange
};
