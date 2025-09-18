import { EventEmitter } from "node:events"

import {
  NotificationType,
  TReadNotificationParams,
  TSendNotificationParams,
} from "./types"

import notificationService from "./notification.service"
import { MongoId } from "../../types/db"

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

notifyEvent.on(
  NotificationType.markAsReadNotifications,
  async (receiverId: MongoId) => {
    return await notificationService.markAsReadNotifications(receiverId)
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

  public static readonly markAsReadNotifications = (receiverId: MongoId) => {
    return notifyEvent.emit(
      NotificationType.markAsReadNotifications,
      receiverId,
    )
  }
}
