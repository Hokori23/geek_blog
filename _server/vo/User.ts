import { isDef } from '@public';
import { DataTypes, Model } from 'sequelize';
import DB from '@database';

interface UserAttributes {
  id: number | null;
  account: string;
  username: string;
  email: string;
  password: string | null;
  avatar_url: string | null;
  bio: string | null;
  power: number;
  social_buttons: string | null;
  createdAt: Date;
  updatedAt: Date;
}

class User extends Model implements UserAttributes {
  public id!: number | null;
  public account!: string;
  public username!: string;
  public email!: string;
  public password!: string | null;
  public avatar_url!: string | null;
  public bio!: string | null;
  public power!: number;
  public social_buttons!: string | null;
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

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增字段（主键）'
    },
    account: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '用户账号'
    },
    username: {
      type: DataTypes.STRING(20),
      unique: 'username',
      allowNull: false,
      comment: '用户名'
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      comment: 'email'
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '密码'
    },
    avatar_url: {
      type: DataTypes.STRING(100),
      comment: '头像图片路径'
    },
    bio: {
      type: DataTypes.TEXT(),
      comment: '自我介绍'
    },
    power: {
      type: DataTypes.TINYINT,
      defaultValue: 2,
      allowNull: false,
      comment: '0：超级管理员；1：管理员；2：其他'
    },
    social_buttons: {
      type: DataTypes.TEXT(),
      comment: '社交链接'
    }
  },
  {
    sequelize: DB,
    tableName: 'user'
  }
);

export default User;
