import { Post, PostTag } from '@vo';
import { Op } from 'sequelize';

/**
 * 添加帖子
 * @param { Post } post
 */
const Create = (post: Post): Promise<Post> => {
  return post.save();
};

/**
 * 通过ID查询单个帖子
 * @param { number } id
 */
const Retrieve__ByID = (id: number): Promise<Post | null> => {
  return Post.findOne({
    where: {
      id
    }
  });
};

/**
 * 分页查询帖子
 * @param { number } offset
 * @param { number } limit
 * @param { boolean } isASC
 */
const Retrieve__Page = (
  offset: number,
  limit: number,
  isASC: boolean = false
): Promise<Array<Post>> => {
  return Post.findAll({
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
 * @param { boolean } isASC
 */
const Retrieve__Fuzzy = (
  offset: number,
  limit: number,
  content: string,
  isASC: boolean = false
): Promise<Array<Post>> => {
  return Post.findAll({
    where: {
      content: {
        [Op.substring]: content
      }
    },
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
