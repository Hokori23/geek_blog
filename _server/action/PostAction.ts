import { Post, PostTag, PostComment } from '@vo';

import { Op, Transaction } from 'sequelize';

/**
 * 添加帖子
 * @param { Post } post
 * @param { Transaction | undefined } t
 */
const Create = (
  post: Post,
  t: Transaction | undefined = undefined
): Promise<Post> => {
  return post.save({ transaction: t });
};

/**
 * 通过ID查询单个帖子
 * @param { number } id
 * @param { boolean } withComments
 */
const Retrieve__ByID = (
  id: number,
  withComments: boolean = true
): Promise<Post | null> => {
  return Post.findOne({
    where: {
      id
    },
    include: withComments ? [PostTag, PostComment] : PostTag
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
 */
const Delete = (id: number): Promise<number> => {
  return Post.destroy({
    where: {
      id
    }
  });
};

export default {
  Create,
  Retrieve__ByID,
  Retrieve__Page,
  Retrieve__Fuzzy,
  Update,
  Delete
};
