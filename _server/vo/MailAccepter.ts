import { DataTypes, Model } from 'sequelize';

import { isDef } from '@public';
import DB from '@database';

interface MailAccepterAttributes {
  id: number | null;
  name: string;
  address: string;
}

class MailAccepter extends Model implements MailAccepterAttributes {
  public id!: number | null;
  public name!: string;
  public address!: string;

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
      allowNull: false,
      comment: '订阅者邮箱名'
    },
    adress: {
      type: DataTypes.STRING(150),
      allowNull: false,
      comment: '订阅者邮箱'
    }
  },
  {
    sequelize: DB,
    tableName: 'mail_accepter'
  }
);

export default MailAccepter;
