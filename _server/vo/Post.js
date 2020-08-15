"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Post = /** @class */ (function () {
    function Post(id, title, content, cover_url, created_at, last_modified_at, view_count, comment_count, is_hidden, is_locked, is_sticky, slug, type) {
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
    return Post;
}());
exports.default = Post;
