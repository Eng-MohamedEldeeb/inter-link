import { EventEmitter } from "node:events"

import {
  NotificationType,
  TReadNotificationParams,
  TSendNotificationParams,
} from "./types"
import notificationService from "./notification.service"

const notifyEvent = new EventEmitter()

notifyEvent.on(
  NotificationType.newNotification,
  async ({ receiverId, sender, body }: TSendNotificationParams) => {
    return await notificationService.sendNotification({
      sender,
      receiverId,
      body,
    })
  },
)

notifyEvent.on(
  NotificationType.readNotifications,
  async ({ socketId, receiverId }: TReadNotificationParams) => {
    return await notificationService.readNewNotifications({
      receiverId,
      socketId,
    })
  },
)
export class Notify {
  public static readonly sendNotification = ({
    body,
    receiverId,
    sender,
  }: TSendNotificationParams) => {
    return notifyEvent.emit(NotificationType.newNotification, {
      body,
      receiverId,
      sender,
    })
  }

  public static readonly readNewNotifications = ({
    socketId,
    receiverId,
  }: TReadNotificationParams) => {
    return notifyEvent.emit(NotificationType.readNotifications, {
      receiverId,
      socketId,
    })
  }
}
