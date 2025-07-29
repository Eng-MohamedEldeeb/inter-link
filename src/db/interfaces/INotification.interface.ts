import { refTo } from '../../common/services/notifications/types'
import { MongoId } from '../../common/types/db'
import { IUser } from './IUser.interface'
import { IPost } from './IPost.interface'
import { IComment } from './IComment.interface'
import { IStory } from './IStory.interface'
import { IMongoDoc } from './IMongo-doc.interface'

export interface INotificationDetails {
  _id?: MongoId
  title: string
  from: MongoId | Pick<IUser, '_id' | 'username' | 'fullName' | 'avatar'>
  refTo: keyof typeof refTo
  on?:
    | MongoId
    | Pick<IPost, '_id' | 'attachments'>
    | Pick<IComment, '_id' | 'attachment'>
    | Pick<IStory, '_id' | 'attachment'>
  createdAt?: Date
}

export interface IFollowedUserNotification extends INotificationDetails {
  from: Pick<IUser, '_id' | 'username' | 'fullName' | 'avatar'>
}

export interface ILikedPostNotification extends INotificationDetails {
  from: Pick<IUser, '_id' | 'username' | 'fullName' | 'avatar'>
  on: Pick<IPost, '_id' | 'attachments'>
}

export interface ILikedCommentNotification extends INotificationDetails {
  from: Pick<IUser, '_id' | 'username' | 'fullName' | 'avatar'>
  on: Pick<IComment, '_id' | 'attachment'>
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

export interface INotifications extends IMongoDoc {
  missed: INotificationDetails[]
  seen: INotificationDetails[]
  belongsTo: MongoId
  totalMissedNotifications: number
}
