import UserAction from './UserAction';
import PostAction from './PostAction';
import PostTagAction from './PostTagAction';
import PostCommentAction from './PostCommentAction';
import MailAccepterAction from './MailAccepterAction';
import SettingAction from './SettingAction';

export {
  UserAction,
  PostAction,
  PostTagAction,
  PostCommentAction,
  MailAccepterAction,
  SettingAction
};
export default {
  User: UserAction,
  Post: PostAction,
  PostTag: PostTagAction,
  PostComment: PostCommentAction,
  MailAccepter: MailAccepterAction,
  Setting: SettingAction
};
