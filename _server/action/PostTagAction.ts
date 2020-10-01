import { Op } from 'sequelize';

import { PostTag, Post } from '@vo';

/**
 * 添加帖子标签
 * @param { PostTag } postTag
 */
const Create = (postTag: PostTag): Promise<PostTag> => {
  return postTag.save();
};

/**
 * 通过ID查询单个帖子标签
 * @param { number } id
 */
const Retrieve__ByID = (id: number): Promise<PostTag | null> => {
  return PostTag.findOne({
    where: {
      id
    }
  });
};

/**
 * 通过Name查询单个帖子标签
 * @param { string } name
 */
const Retrieve__ByTagName = (name: string): Promise<PostTag | null> => {
  return PostTag.findOne({
    where: {
      name
    }
  });
};

/**
 * 通过标签名查询帖子（分页）
 * @param { string } tag_name
 * @param { number } offset
 * @param { number } limit
 * @param { boolean } isASC
 */
const Retrieve__ByTagNameInPage = (
  name: string,
  offset: number,
  limit: number,
  isASC: boolean = false
): Promise<PostTag | null> => {
  return PostTag.findOne({
    where: {
      name: name
    },
    include: Post,
    offset,
    limit,
    order: [['createdAt', isASC ? 'ASC' : 'DESC']]
  });
};

/**
 * 遍历帖子标签名
 */
const Retrieve__All = (): Promise<Array<PostTag>> => {
  return PostTag.findAll();
};

/**
 * 更新帖子标签
 * @param { PostTag } oldPostTag
 * @param { PostTag } newPostTag
 */
const Update = (oldPostTag: PostTag, newPostTag: PostTag): Promise<PostTag> => {
  return Object.assign(oldPostTag, newPostTag).save();
};

/**
 * 删除帖子标签
 * @param { number } id
 */
const Delete = (id: number): Promise<number> => {
  return PostTag.destroy({
    where: {
      id
    }
  });
};

export default {
  Create,
  Retrieve__ByID,
  Retrieve__ByTagName,
  Retrieve__ByTagNameInPage,
  Retrieve__All,
  Update,
  Delete
};
