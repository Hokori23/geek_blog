import { DataTypes, Model } from 'sequelize';

import { isDef } from '@public';
import DB from '@database';

interface MailAccepterAttributes {
  id: number | null;
  name: string;
  address: string;
  isActived: boolean | null;
}

class MailAccepter extends Model implements MailAccepterAttributes {
  public id!: number | null;
  public name!: string;
  public address!: string;
  public isActived!: boolean | null;

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

MailAccepter.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增字段（主键）'
    },
    name: {
      type: DataTypes.STRING(20),
      unique: 'name',
      validate: {
        notNull: {
          msg: '名字不能为空'
        },
        notEmpty: {
          msg: '名字不能为空'
        },
        len: {
          args: [2, 20],
          msg: '名字长度应为2至20字符'
        }
      },
      comment: '订阅者邮箱名'
    },
    address: {
      type: DataTypes.STRING(150),
      unique: 'address',
      validate: {
        isEmail: {
          msg: '请输入邮箱格式'
        },
        notNull: {
          msg: '邮箱不能为空'
        },
        notEmpty: {
          msg: '邮箱不能为空'
        }
      },
      comment: '订阅者邮箱'
    },
    isActived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '是否激活'
    }
  },
  {
    sequelize: DB,
    tableName: 'mail_accepter'
  }
);

export default MailAccepter;
