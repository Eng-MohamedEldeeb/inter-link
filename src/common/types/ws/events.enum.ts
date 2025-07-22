export enum EventType {
  followUser = 'follow:user',

  likePost = 'like:post',

  addComment = 'add:comment',
  likeComment = 'like:comment',

  addReply = 'add:reply',
  likeReply = 'like:reply',

  likeStory = 'like:story',

  userFollowed = 'user:followed',
  postLiked = 'post:liked',
  commentLiked = 'comment:liked',
  replyLiked = 'reply:liked',
  stroyLiked = 'stroy:liked',

  notification = 'notification',
  missedNotifications = 'missed-notifications',
}
