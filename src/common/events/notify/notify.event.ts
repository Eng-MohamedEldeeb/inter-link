import EventEmitter from "node:events"

import notificationsService from "../../utils/notify/notifications.service"
import {
  TReadNotificationParams,
  TSendNotificationParams,
} from "../../utils/notify/types"

export const notifyEvent = new EventEmitter()

notifyEvent.on(
  "send-notification",
  async ({ notificationDetails, userId }: TSendNotificationParams) => {
    return await notificationsService.sendNotification({
      userId,
      notificationDetails,
    })
  },
)

notifyEvent.on(
  "read-missed-notification",
  async ({ socketId, userId }: TReadNotificationParams) => {
    return await notificationsService.readMissedNotifications({
      userId,
      socketId,
    })
  },
)

export default notifyEvent
