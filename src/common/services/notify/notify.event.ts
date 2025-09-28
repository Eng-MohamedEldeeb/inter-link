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
  async ({ receiver, sender, body }: TSendNotificationParams) => {
    return await notificationService.sendNotification({
      sender,
      receiver,
      body,
    })
  },
)

notifyEvent.on(
  NotificationType.readNotifications,
  async ({ socketId, receiver }: TReadNotificationParams) => {
    return await notificationService.readNewNotifications({
      receiver,
      socketId,
    })
  },
)

notifyEvent.on(
  NotificationType.markAsReadNotifications,
  async (receiver: MongoId) => {
    return await notificationService.markAsReadNotifications(receiver)
  },
)
export class Notify {
  public static readonly sendNotification = ({
    sender,
    receiver,
    body,
  }: TSendNotificationParams) => {
    return notifyEvent.emit(NotificationType.newNotification, {
      sender,
      receiver,
      body,
    })
  }

  public static readonly readNewNotifications = ({
    socketId,
    receiver,
  }: TReadNotificationParams) => {
    return notifyEvent.emit(NotificationType.readNotifications, {
      receiver,
      socketId,
    })
  }

  public static readonly markAsReadNotifications = (receiver: MongoId) => {
    return notifyEvent.emit(NotificationType.markAsReadNotifications, receiver)
  }
}
