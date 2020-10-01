import UserAction from './UserAction';
import PostAction from './PostAction';
import PostTagAction from './PostTagAction';
import PostCommentAction from './PostCommentAction';
import MailAccepterAction from './MailAccepterAction';

export {
  UserAction,
  PostAction,
  PostTagAction,
  PostCommentAction,
  MailAccepterAction
};
export default {
  User: UserAction,
  Post: PostAction,
  PostTag: PostTagAction,
  PostComment: PostCommentAction,
  MailAccepter: MailAccepterAction
};
