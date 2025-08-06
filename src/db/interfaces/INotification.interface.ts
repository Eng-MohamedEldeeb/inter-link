import { refTo } from '../../common/services/notifications/types'
import { MongoId } from '../../common/types/db'
import { IUser } from './IUser.interface'
import { IPost } from './IPost.interface'
import { IComment } from './IComment.interface'
import { IStory } from './IStory.interface'
import { IMongoDoc } from '../../common/interface/IMongo-doc.interface'

export type UserDetails = Pick<
  IUser,
  '_id' | 'username' | 'fullName' | 'avatar'
>
type PostDetails = Pick<IPost, '_id' | 'attachments'>
type CommentDetails = Pick<IComment, '_id' | 'attachment'>
type StoryDetails = Pick<IStory, '_id' | 'attachment'>

export interface INotificationInputs {
  _id?: MongoId
  notificationMessage: string
  from: MongoId | UserDetails
  refTo: keyof typeof refTo
  on?: MongoId | PostDetails | CommentDetails | StoryDetails
  content?: string
  sentAt: string
  updatedAt?: Date
}

export interface IFollowedUserNotification extends INotificationInputs {
  from: UserDetails
}

export interface ILikedPostNotification extends INotificationInputs {
  from: UserDetails
  on: PostDetails
}

export interface ILikedCommentNotification extends INotificationInputs {
  from: UserDetails
  on: CommentDetails
}

export interface ICommentedOnPostNotification extends INotificationInputs {
  from: UserDetails
  content: string
  on: PostDetails
}

export interface IReplyToCommentNotification extends INotificationInputs {
  content: string
  on: CommentDetails
}

export interface ILikedStoryNotification extends INotificationInputs {
  on: StoryDetails
}

export type MessageDetails = Pick<
  INotificationInputs,
  'notificationMessage' | 'sentAt' | 'from' | 'updatedAt'
>

export interface IMissedMessages {
  from: MongoId | UserDetails
  messages: Omit<MessageDetails, 'from'>[]
}
export interface INotifications extends IMongoDoc {
  missedNotifications: INotificationInputs[]
  missedMessages: IMissedMessages[]
  seen: INotificationInputs[]
  belongsTo: MongoId
  totalMissedNotifications: number
}
