import { IMongoDoc } from "../../common/interface/IMongo-doc.interface"
import { MongoId } from "../../common/types/db"
import { IUser } from "./IUser.interface"

export enum NotificationRefType {
  User = "User",
  Post = "Post",
  Comment = "Comment",
  Community = "Community",
  Story = "Story",
  Chat = "Chat",
  Group = "Group",
  Message = "Message",
}

export enum NotificationStatus {
  sent = "sent",
  received = "received",
  seen = "seen",
}

export interface INotificationInputs {
  sender: MongoId | IUser
  message: string
  relatedTo: MongoId
  ref: NotificationRefType
  receiver: MongoId
  sentAt?: string
}

export interface INotification extends INotificationInputs, IMongoDoc {
  status: NotificationStatus

  receivedAt?: Date
  seenAt?: Date

  deletedAt?: Date
}
