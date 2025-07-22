import {
  IFollowedUserNotification,
  ILikedPostNotification,
  ICommentedOnPostNotification,
  IReplyToCommentNotification,
  ILikedStoryNotification,
} from '../interface/INotification.interface'

export type TNotificationDetails =
  | IFollowedUserNotification
  | ILikedPostNotification
  | ICommentedOnPostNotification
  | IReplyToCommentNotification
  | ILikedStoryNotification

export enum refTo {
  User = 'User',
  Post = 'Post',
  Comment = 'Comment',
  Reply = 'Reply',
  Story = 'Story',
}
