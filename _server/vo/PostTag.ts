import { isDef } from '@public';
import { DataTypes, Model } from 'sequelize';
import { Post } from '@vo';
import DB from '@database';

interface PostTagAttributes {
  id: number | null;
  name: string;
  description: string | null;
  parent_id: number | null;
  icon_display: boolean | null;
  icon_class: string;
  icon_color: string;
  slug: string;
  Posts: Array<Post> | null;
  createdAt: Date;
  updatedAt: Date;
}

class PostTag extends Model implements PostTagAttributes {
  public id!: number | null;
  public name!: string;
  public description!: string | null;
  public parent_id!: number | null;
  public icon_display!: boolean | null;
  public icon_class!: string;
  public icon_color!: string;
  public slug!: string;
  public Posts!: Array<Post> | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PostTag.init(
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
      comment: '标签名'
    },
    description: {
      type: DataTypes.TEXT,
      comment: '标签简述'
    },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      comment: '父分类id'
    },
    slug: {
      type: DataTypes.STRING(20),
      unique: 'slug',
      allowNull: false,
      comment: '静态链接slug'
    },
    icon_display: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '图标是否显示: { 0: 不显示, 1: 显示 }'
    },
    icon_class: {
      type: DataTypes.STRING(100),
      comment: '图标icon class'
    },
    icon_color: {
      type: DataTypes.STRING(50),
      comment: '图标颜色: { 16位进值 | rgb | rgba }'
    }
  },
  {
    sequelize: DB,
    tableName: 'post_tag'
  }
);
export default PostTag;
