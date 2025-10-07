import { IMongoDoc } from "../../common/interface/IMongo-doc.interface"
import { MongoId } from "../../common/types/db"
import { IUser } from "./IUser.interface"

// export enum InteractionType {
//   User = "User",
//   Post = "Post",
//   Comment = "Comment",
//   Community = "Community",
//   Story = "Story",
//   Chat = "Chat",
//   Group = "Group",
//   Message = "Message",
// }

export enum InteractionType {
  newLike = "new-like",
  newReply = "new-reply",
  newFollow = "new-follow",
  newMessage = "new-message",
}

export enum NotificationStatus {
  sent = "sent",
  received = "received",
  seen = "seen",
}

export interface INotificationInputs {
  sender: MongoId | Pick<IUser, "_id" | "avatar" | "username">
  receiver: MongoId

  interactionType: InteractionType

  onPost?: MongoId
  onComment?: MongoId

  repliedWith?: MongoId

  likedBy?: MongoId[]
  followedBy?: MongoId

  message?: string

  sentAt?: string
  status: NotificationStatus
}

export interface INotification extends INotificationInputs, IMongoDoc {
  receivedAt?: Date
  seenAt?: Date

  deletedAt?: Date
}
