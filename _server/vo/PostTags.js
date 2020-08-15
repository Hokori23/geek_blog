"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostTags = void 0;
var PostTags = /** @class */ (function () {
    function PostTags(id, post_id, name, description, parent_id, icon_display, icon_class, icon_color) {
        this.id = id;
        this.post_id = post_id;
        this.name = name;
        this.description = description;
        this.parent_id = parent_id;
        this.icon_display = icon_display;
        this.icon_class = icon_class;
        this.icon_color = icon_color;
    }
    return PostTags;
}());
exports.PostTags = PostTags;
