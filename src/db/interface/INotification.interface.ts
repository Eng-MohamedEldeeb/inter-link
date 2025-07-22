import { refTo } from '../types/notification.type'
import { MongoId } from '../../common/types/db/db.types'
import { IUser } from './IUser.interface'
import { IPost } from './IPost.interface'
import { IComment } from './IComment.interface'
import { IStory } from './IStory.interface'

export interface INotificationDetails {
  title: string
  from: MongoId | Partial<IUser> | Partial<IPost> | Partial<IComment>
  refTo: keyof typeof refTo
}
export interface IFollowedUserNotification extends INotificationDetails {
  from: Pick<IUser, '_id' | 'username' | 'fullName' | 'avatar'>
}

export interface ILikedPostNotification extends INotificationDetails {
  from: Pick<IUser, '_id' | 'username' | 'fullName' | 'avatar'>
  on: Pick<IPost, '_id' | 'attachments'>
}

export interface ICommentedOnPostNotification extends INotificationDetails {
  from: Pick<IUser, '_id' | 'username' | 'fullName' | 'avatar'>
  content: string
  on: Pick<IPost, '_id' | 'attachments'>
}

export interface IReplyToCommentNotification extends INotificationDetails {
  content: string
  on: Pick<IComment, '_id' | 'attachment'>
}

export interface ILikedStoryNotification extends INotificationDetails {
  on: Pick<IStory, '_id' | 'attachment'>
}

export interface INotification {
  missed: INotificationDetails[]
  seen: INotificationDetails[]
  belongsTo: MongoId
}
