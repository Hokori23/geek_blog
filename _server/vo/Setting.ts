import { isDef } from '@public';
import { DataTypes, Model } from 'sequelize';
import DB from '@database';

interface SettingAttribute {
  id: number | null;
  name: string;
  setting_json: string;
}

class Setting extends Model implements SettingAttribute {
  public id!: number | null;
  public name!: string;
  public setting_json!: string;

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

Setting.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增字段（主键）'
    },
    name: {
      type: DataTypes.STRING(50),
      unique: 'name',
      allowNull: false,
      comment: '设置名'
    },
    setting_json: {
      type: DataTypes.TEXT,
      defaultValue: '{}'
    }
  },
  {
    sequelize: DB,
    tableName: 'setting'
  }
);
export default Setting;
