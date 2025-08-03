import { refTo } from '../../common/services/notifications/types'
import { MongoId } from '../../common/types/db'
import { IUser } from './IUser.interface'
import { IPost } from './IPost.interface'
import { IComment } from './IComment.interface'
import { IStory } from './IStory.interface'
import { IMongoDoc } from './IMongo-doc.interface'

export interface INotificationInputs {
  title: string
  from: MongoId | Pick<IUser, '_id' | 'username' | 'fullName' | 'avatar'>
  refTo: keyof typeof refTo
  on?:
    | MongoId
    | Pick<IPost, '_id' | 'attachments'>
    | Pick<IComment, '_id' | 'attachment'>
    | Pick<IStory, '_id' | 'attachment'>
  content?: string
  sentAt: string
}

export interface IFollowedUserNotification extends INotificationInputs {
  from: Pick<IUser, '_id' | 'username' | 'fullName' | 'avatar'>
}

export interface ILikedPostNotification extends INotificationInputs {
  from: Pick<IUser, '_id' | 'username' | 'fullName' | 'avatar'>
  on: Pick<IPost, '_id' | 'attachments'>
}

export interface ILikedCommentNotification extends INotificationInputs {
  from: Pick<IUser, '_id' | 'username' | 'fullName' | 'avatar'>
  on: Pick<IComment, '_id' | 'attachment'>
}

export interface ICommentedOnPostNotification extends INotificationInputs {
  from: Pick<IUser, '_id' | 'username' | 'fullName' | 'avatar'>
  content: string
  on: Pick<IPost, '_id' | 'attachments'>
}

export interface IReplyToCommentNotification extends INotificationInputs {
  content: string
  on: Pick<IComment, '_id' | 'attachment'>
}

export interface ILikedStoryNotification extends INotificationInputs {
  on: Pick<IStory, '_id' | 'attachment'>
}

export interface INotificationSlice
  extends Partial<IMongoDoc>,
    INotificationInputs {}

export interface INotifications extends IMongoDoc {
  missed: INotificationSlice[]
  missedMessages: INotificationSlice[]
  seen: INotificationSlice[]
  belongsTo: MongoId
  totalMissedNotifications: number
}
