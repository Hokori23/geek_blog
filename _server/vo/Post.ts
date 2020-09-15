import { isUndef } from '@public';

interface Post {
  id: number;
  content: string;
  created_at: string;
  view_count: number;
  comment_count: number;
  is_hidden: boolean;
  is_locked: boolean;
  is_sticky: boolean;
  type: boolean;
  title?: string;
  cover_url?: string;
  last_modified_at?: string;
  tag?: string;
}

class Post implements Post {
  constructor(
    id: number,
    content: string,
    created_at: string,
    view_count: number,
    comment_count: number,
    is_hidden: boolean,
    is_locked: boolean,
    is_sticky: boolean,
    type: boolean,
    title?: string,
    cover_url?: string,
    last_modified_at?: string,
    tag?: string
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.cover_url = cover_url;
    this.created_at = created_at;
    this.last_modified_at = last_modified_at;
    this.view_count = view_count;
    this.comment_count = comment_count;
    this.is_hidden = is_hidden;
    this.is_locked = is_locked;
    this.is_sticky = is_sticky;
    this.tag = tag;
    this.type = type;
  }
  toArray(): Array<any> {
    const {
      id,
      content,
      created_at,
      view_count,
      comment_count,
      is_hidden,
      is_locked,
      is_sticky,
      type,
      title,
      cover_url,
      last_modified_at,
      tag
    } = this;
    return [
      id,
      title,
      content,
      cover_url,
      created_at,
      last_modified_at,
      view_count,
      comment_count,
      is_hidden,
      is_locked,
      is_sticky,
      tag,
      type
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
  static clone(obj: Post): Post {
    const {
      id,
      content,
      created_at,
      view_count,
      comment_count,
      is_hidden,
      is_locked,
      is_sticky,
      type,
      title,
      cover_url,
      last_modified_at,
      tag
    } = obj;
    return new Post(
      id,
      content,
      created_at,
      view_count,
      comment_count,
      is_hidden,
      is_locked,
      is_sticky,
      type,
      title,
      cover_url,
      last_modified_at,
      tag
    );
  }
}

export default Post;
