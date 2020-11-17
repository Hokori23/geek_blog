import { DataTypes, Model } from 'sequelize';

import { isDef } from '@public';
import DB from '@database';

interface PostCommentAttributes {
  id: number | null;
  post_id: number;
  parent_id: number | null; // TODO 为null时是顶层评论，记得处理结果集
  content: string;
  username: string;
  email: string;
  site_url: string | null;
  receive_reply_mail: boolean;
  ip: string | null;
  ip_location: string | null;
  user_agent: string | null;
}

class PostComment extends Model implements PostCommentAttributes {
  public id!: number | null;
  public post_id!: number;
  public parent_id!: number | null; // 为null时是顶层评论，记得处理结果集
  public content!: string;
  public username!: string;
  public email!: string;
  public site_url!: string | null;
  public ip!: string | null;
  public ip_location!: string | null;
  public user_agent!: string | null;
  public receive_reply_mail!: boolean;
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
      validate: {
        isInt: true
      },
      comment: '父评论id'
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: '评论不能为空'
        },
        notEmpty: {
          msg: '评论不能为空'
        },
        max: {
          args: [255],
          msg: '评论最大长度为255字符'
        }
      },
      comment: '评论内容'
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notNull: {
          msg: '用户名不能为空'
        },
        notEmpty: {
          msg: '用户名不能为空'
        },
        max: {
          args: [20],
          msg: '用户名最大长度为20字符'
        }
      },
      comment: '评论者用户名'
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notNull: {
          msg: '邮箱不能为空'
        },
        notEmpty: {
          msg: '邮箱不能为空'
        },
        isEmail: {
          msg: '请输入邮箱格式'
        }
      },
      comment: '评论者邮箱'
    },
    site_url: {
      type: DataTypes.STRING(255),
      validate: {
        isUrl: {
          msg: '请输入合法网站链接'
        }
      },
      comment: '评论者网站'
    },
    ip: {
      type: DataTypes.STRING(50),
      validate: {
        isIP: true
      },
      comment: '评论者IP'
    },
    ip_location: {
      type: DataTypes.STRING(50),
      comment: '评论者IP地理位置'
    },
    user_agent: {
      type: DataTypes.STRING(255),
      comment: '评论者User-Agent'
    },
    receive_reply_mail: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '有回复时是否接受邮件'
    }
  },
  {
    sequelize: DB,
    tableName: 'post_comment'
  }
);
export default PostComment;
