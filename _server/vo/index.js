"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostTags = exports.Post = exports.User = void 0;
var User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
var Post_1 = __importDefault(require("./Post"));
exports.Post = Post_1.default;
var PostTags_1 = __importDefault(require("./PostTags"));
exports.PostTags = PostTags_1.default;
exports.default = { User: User_1.default, Post: Post_1.default, PostTags: PostTags_1.default };
