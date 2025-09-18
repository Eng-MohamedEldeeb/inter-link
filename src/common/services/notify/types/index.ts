import { ICommunity } from "../../../../db/interfaces/ICommunity.interface"
import { INotificationInputs } from "../../../../db/interfaces/INotification.interface"
import { IUser } from "../../../../db/interfaces/IUser.interface"
import { MongoId } from "../../../types/db"

export enum NotificationType {
  newNotification = "new-notification",
  readNotifications = "read-notification",

  newMessage = "new-message",
  newMissedMessage = "new-missed-message",
  newGroupMessage = "new-group-message",

  markAsReadNotifications = "mark-as-read-notifications",
}

export type SenderDetails = Partial<
  Pick<IUser, "_id" | "avatar" | "username"> &
    Pick<ICommunity, "_id" | "cover" | "name">
>
export type NotificationBody = Pick<
  INotificationInputs,
  "message" | "sentAt" | "relatedTo" | "refTo"
>

export type NotificationBodyMessage = Pick<
  NotificationBody,
  "message" | "sentAt"
>

export type TSendNotificationParams = {
  sender: SenderDetails
  receiverId: MongoId
  body: NotificationBody
}

export type TReadNotificationParams = {
  receiverId: MongoId
  socketId: string
}
