import UserService from './UserService';
import PostService from './PostService';
import PostTagsService from './PostTagsService';

export { UserService, PostService, PostTagsService };
export default {
  User: UserService,
  Post: PostService,
  PostTags: PostTagsService
};
