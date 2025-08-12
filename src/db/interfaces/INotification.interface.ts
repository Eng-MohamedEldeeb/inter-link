import { ReftTo } from '../../common/services/notifications/types'
import { MongoId } from '../../common/types/db'
import { IUser } from './IUser.interface'
import { IPost } from './IPost.interface'
import { IComment } from './IComment.interface'
import { IStory } from './IStory.interface'
import { IMongoDoc } from '../../common/interface/IMongo-doc.interface'
import { IChat } from './IChat.interface'
import { IGroup } from './IGroup.interface'

export type UserDetails = Pick<
  IUser,
  '_id' | 'username' | 'fullName' | 'avatar'
>
type PostDetails = Pick<IPost, '_id' | 'attachments'>
type CommentDetails = Pick<IComment, '_id' | 'attachment'>
type StoryDetails = Pick<IStory, '_id' | 'attachment'>
type ChatDetails = Pick<IChat, '_id'>
type GroupDetails = Pick<IGroup, '_id'>

export interface INotificationInputs {
  _id?: MongoId
  message: string
  messageId?: MongoId
  from: MongoId | UserDetails
  refTo: ReftTo
  on?:
    | MongoId
    | PostDetails
    | CommentDetails
    | StoryDetails
    | ChatDetails
    | GroupDetails
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
  'message' | 'sentAt' | 'from' | 'updatedAt' | 'messageId' | 'refTo'
>

export interface IMissedMessages extends MessageDetails, Partial<IMongoDoc> {}
export interface INotifications extends IMongoDoc {
  missedNotifications: INotificationInputs[]
  missedMessages: IMissedMessages[]
  seen: INotificationInputs[]
  belongsTo: MongoId
  totalMissedNotifications: number
}
