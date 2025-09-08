import { INotificationInputs } from "../../../../db/interfaces/INotification.interface"
import { MongoId } from "../../../types/db"

export enum NotificationType {
  newNotification = "new-notification",
  newMessage = "new-message",
  newGroupMessage = "new-group-message",
}

export enum RefTypes {
  User = "User",
  Post = "Post",
  Comment = "Comment",
  Community = "Community",
  Story = "Story",
  Chat = "Chat",
  Group = "Group",
}

export type RefTo = keyof typeof RefTypes

export type UserStatus = {
  socketId: string
  isConnected: boolean
}

export type RoomMembers = string[]

export type TSendNotificationParams = {
  userId: MongoId
  notificationDetails: INotificationInputs
}

export type TReadNotificationParams = {
  userId: MongoId
  socketId: string
}
