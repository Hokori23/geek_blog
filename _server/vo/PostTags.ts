import { isUndef } from '@public';

interface PostTags {
  id: number;
  post_id: number;
  name: string;
  description?: string;
  parent_id?: number;
  icon_display?: boolean;
  icon_class: string;
  icon_color: string;
  slug?: string;
}

class PostTags implements PostTags {
  constructor(
    id: number,
    post_id: number,
    name: string,
    icon_class: string,
    icon_color: string,
    parent_id?: number,
    description?: string,
    icon_display?: boolean,
    slug?: string
  ) {
    this.id = id;
    this.post_id = post_id;
    this.name = name;
    this.description = description;
    this.parent_id = parent_id;
    this.icon_display = icon_display;
    this.icon_class = icon_class;
    this.icon_color = icon_color;
    this.slug = slug;
  }
  toArray(): Array<any> {
    const {
      id,
      post_id,
      name,
      description,
      parent_id,
      icon_display,
      icon_class,
      icon_color,
      slug
    } = this;
    return [
      id,
      post_id,
      name,
      description,
      parent_id,
      icon_display,
      icon_class,
      icon_color,
      slug
    ];
  }
  // 检查参数完整性
  checkIntegrity(params?: Array<string>): boolean {
    if (params) {
      for (let i = 0; i < params.length; i++) {
        if (isUndef(this[params[i]])) {
          return false;
        }
      }
      return true;
    } else {
      const arr = this.toArray();
      for (let i = 0; i < arr.length; i++) {
        if (isUndef(arr[i])) {
          return false;
        }
      }
      return true;
    }
  }
  static clone(obj: PostTags): PostTags {
    const {
      id,
      post_id,
      name,
      description,
      parent_id,
      icon_display,
      icon_class,
      icon_color,
      slug
    } = obj;
    return new PostTags(
      id,
      post_id,
      name,
      icon_class,
      icon_color,
      parent_id,
      description,
      icon_display,
      slug
    );
  }
}

export default PostTags;
