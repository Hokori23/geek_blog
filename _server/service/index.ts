import UserService from './UserService';
import PostService from './PostService';
import PostTagService from './PostTagService';

export { UserService, PostService, PostTagService };
export default {
  User: UserService,
  Post: PostService,
  PostTag: PostTagService
};
