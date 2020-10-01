import { DataTypes, Model } from 'sequelize';

import { isDef } from '@public';
import DB from '@database';

interface PostCommentAttributes {
  id: number | null;
  parent_id: number | null; // 为null时是顶层评论，记得处理结果集
  content: string;
  username: string;
  email: string;
  site_url: string | null;
  ip: string | null;
  ip_location: string | null;
  user_agent: string | null;
}

class PostComment extends Model implements PostCommentAttributes {
  public id!: number | null;
  public parent_id!: number | null; // 为null时是顶层评论，记得处理结果集
  public content!: string;
  public username!: string;
  public email!: string;
  public site_url!: string | null;
  public ip!: string | null;
  public ip_location!: string | null;
  public user_agent!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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

PostComment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增字段（主键）'
    },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      comment: '父评论id'
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '评论内容'
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '评论者用户名'
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      comment: '评论者邮箱'
    },
    site_url: {
      type: DataTypes.STRING(255),
      comment: '评论者网站'
    },
    ip: {
      type: DataTypes.STRING(50),
      comment: '评论者IP'
    },
    ip_location: {
      type: DataTypes.STRING(50),
      comment: '评论者IP地理位置'
    },
    user_agent: {
      type: DataTypes.STRING(255),
      comment: '评论者User-Agent'
    }
  },
  {
    sequelize: DB,
    tableName: 'post_comment'
  }
);
export default PostComment;
