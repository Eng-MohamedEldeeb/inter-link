import { ICommunity } from "../../../../db/interfaces/ICommunity.interface"
import {
  INotificationInputs,
  NotificationStatus,
} from "../../../../db/interfaces/INotification.interface"
import { IUser } from "../../../../db/interfaces/IUser.interface"
import { MongoId } from "../../../types/db"

export enum NotificationType {
  newNotification = "new-notification",
  readNotifications = "read-notification",

  newMessage = "new-message",
  newMissedMessage = "new-missed-message",
  newGroupMessage = "new-group-message",

  markAsReadNotifications = "mark-as-read-notifications",

  typing = "typing",
}

export type SenderDetails = Partial<
  Pick<IUser, "_id" | "avatar" | "username"> &
    Pick<ICommunity, "_id" | "cover" | "name">
>

export type TSendNotificationParams = {
  sender: SenderDetails
  receiver: MongoId
  body: Omit<
    INotificationInputs,
    "receiver" | "sender" | "likedBy" | "followedBy" | "status"
  >
}

export type TReadNotificationParams = {
  receiver: MongoId
  socketId: string
}

export type Timestamp =
  | {
      receivedAt: Date
      sentAt: string | undefined
      status: NotificationStatus
    }
  | {
      sentAt: string | undefined
      status: NotificationStatus
      receivedAt?: undefined
    }

export type NotificationDetails = {
  timestamp: Timestamp
  socketId: string
  data: TSendNotificationParams
}
