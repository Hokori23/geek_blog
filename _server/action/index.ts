import UserAction from './UserAction';
import PostAction from './PostAction';
import PostTagAction from './PostTagAction';
import PostCommentAction from './PostCommentAction';

export { UserAction, PostAction, PostTagAction, PostCommentAction };
export default {
  User: UserAction,
  Post: PostAction,
  PostTag: PostTagAction,
  PostComment: PostCommentAction
};
