import {
  DataTypes,
  Model,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin
} from 'sequelize';

import { isDef } from '@public';
import { PostTag, PostComment } from '@vo';
import DB from '@database';

interface PostAttributes {
  id: number | null;
  user_account: string;
  title: string | null;
  content: string;
  view_count: number;
  comment_count: number;
  is_hidden: boolean;
  is_locked: boolean;
  is_sticky: boolean;
  type: number;
  cover_url: string | null;
  createdAt: Date;
  updatedAt: Date;
}

class Post extends Model implements PostAttributes {
  public id!: number | null;
  public user_account!: string;
  public title!: string | null;
  public content!: string;
  public view_count!: number;
  public comment_count!: number;
  public is_hidden!: boolean;
  public is_locked!: boolean;
  public is_sticky!: boolean;
  public type!: number;
  public cover_url!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getPostTags!: HasManyGetAssociationsMixin<PostTag>;
  public addPostTag!: HasManyAddAssociationMixin<PostTag, number>;
  public hasPostTag!: HasManyHasAssociationMixin<PostTag, number>;
  public countPostTags!: HasManyCountAssociationsMixin;
  public createPostTag!: HasManyCreateAssociationMixin<PostTag>;

  public getPostComments!: HasManyGetAssociationsMixin<PostComment>;
  public addPostComment!: HasManyAddAssociationMixin<PostComment, number>;
  public hasPostComment!: HasManyHasAssociationMixin<PostComment, number>;
  public countPostComments!: HasManyCountAssociationsMixin;
  public createPostComment!: HasManyCreateAssociationMixin<PostComment>;

  // 属性转数组
  static toArray(): Array<any> {
    const res = [] as Array<any>;
    Object.keys(this).forEach((key) => {
      res.push(this[key]);
    });
    return res;
  }
  // 检查参数完整性
  static checkIntegrity(params?: Array<string>): boolean {
    return params
      ? params.every((v) => {
          return isDef(v);
        })
      : this.toArray().every((v) => {
          return isDef(v);
        });
  }
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增字段（主键）'
    },
    user_account: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '用户账号'
    },
    title: {
      type: DataTypes.STRING(50),
      comment: '帖子标题'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '帖子内容'
    },
    view_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '访问数'
    },
    comment_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '评论数'
    },
    is_hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '是否隐藏'
    },
    is_locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '可否评论'
    },
    is_sticky: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      comment: '是否置顶or置顶优先级'
    },
    type: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      comment: '文章类别参考: { 0: 文章, 1: LandScape文章, 2: 说说 }'
    },
    cover_url: {
      type: DataTypes.STRING(100),
      comment: '封面图片文件路径'
    }
  },
  {
    sequelize: DB,
    tableName: 'post'
  }
);
export default Post;
