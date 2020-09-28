import { isDef } from '@public';
import { DataTypes, Model } from 'sequelize';
import DB from '@database';

class User extends Model {
  toArray(): Array<any> {
    const res = [] as Array<any>;
    Object.keys(this).forEach((key) => {
      res.push(this[key]);
    });
    return res;
  }
  // 检查参数完整性
  checkIntegrity(params?: Array<string>): boolean {
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
      allowNull: false,
      comment: '自增字段（主键）'
    },
    account: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '用户账号'
    },
    username: {
      type: DataTypes.STRING(20),
      unique: true,
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
      type: DataTypes.TEXT,
      comment: '自我介绍'
    },
    power: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      allowNull: false,
      comment: '0：超级管理员；1：管理员；2：其他'
    },
    social_buttons: {
      type: DataTypes.TEXT,
      comment: '社交链接'
    },
  },
  {
    sequelize: DB,
    modelName: 'User',
    tableName: 'user'
  }
);

export default User;
