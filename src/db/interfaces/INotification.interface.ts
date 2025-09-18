import { IMongoDoc } from "../../common/interface/IMongo-doc.interface"
import { MongoId } from "../../common/types/db"

export enum NotificationRefTo {
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
  sender: MongoId
  message: string
  relatedTo?: MongoId
  refTo: NotificationRefTo
  receiver: MongoId
  sentAt?: string
}

export interface INotification extends INotificationInputs, IMongoDoc {
  status: NotificationStatus

  receivedAt?: Date
  seenAt?: Date

  deletedAt?: Date
}
