import User from './User';
import Post from './Post';
import PostTag from './PostTag';
import PostComment from './PostComment';
import MailAccepter from './MailAccepter';
import Setting from './Setting';

// Post : PostTag = N : M
Post.belongsToMany(PostTag, {
  through: 'post__post_tag',
  targetKey: 'name',
  sourceKey: 'id'
});
PostTag.belongsToMany(Post, {
  through: 'post__post_tag',
  targetKey: 'id',
  sourceKey: 'name'
});

// Post : PostComment = 1 : N
Post.hasMany(PostComment, {
  foreignKey: 'post_id'
});
PostComment.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
});

export { User, Post, PostTag, PostComment, MailAccepter, Setting };
export default { User, Post, PostTag, PostComment, MailAccepter, Setting };
