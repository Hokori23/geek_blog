import UserService from './UserService';
import PostService from './PostService';
import PostTagService from './PostTagService';
import PostCommentService from './PostCommentService';
import MailAccepterService from './MailAccepterService';

export {
  UserService,
  PostService,
  PostTagService,
  PostCommentService,
  MailAccepterService
};
export default {
  User: UserService,
  Post: PostService,
  PostTag: PostTagService,
  PostComment: PostCommentService,
  MailAccepter: MailAccepterService
};
