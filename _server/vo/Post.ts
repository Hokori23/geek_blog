interface Post {
  id: number;
  title: string;
  content: string;
  cover_url: string;
  created_at: string;
  last_modified_at: string;
  view_count: number;
  comment_count: number;
  is_hidden: boolean;
  is_locked: boolean;
  is_sticky: boolean;
  slug: string;
  type: boolean;
}

class Post implements Post{
  constructor(
    id: number,
    title: string,
    content: string,
    cover_url: string,
    created_at: string,
    last_modified_at: string,
    view_count: number,
    comment_count: number,
    is_hidden: boolean,
    is_locked: boolean,
    is_sticky: boolean,
    slug: string,
    type: boolean
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
    this.slug = slug;
    this.type = type;
  }
}

export default Post;
