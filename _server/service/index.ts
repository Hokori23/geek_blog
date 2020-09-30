import UserService from './UserService';
import PostService from './PostService';
import PostTagService from './PostTagService';
import PostCommentService from './PostCommentService';

export { UserService, PostService, PostTagService, PostCommentService };
export default {
  User: UserService,
  Post: PostService,
  PostTag: PostTagService,
  PostComment: PostCommentService
};
