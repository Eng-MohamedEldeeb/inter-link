import notifyEvent from "../../events/notify/notify.event"
import {
  TReadNotificationParams,
  TSendNotificationParams,
} from "../../utils/notify/types"

class NotifyService {
  public readonly sendNotification = ({
    notificationDetails,
    userId,
  }: TSendNotificationParams) => {
    return notifyEvent.emit("send-notification", {
      notificationDetails,
      userId,
    })
  }

  public readonly readMissedNotifications = ({
    socketId,
    userId,
  }: TReadNotificationParams) => {
    return notifyEvent.emit("read-missed-notification", {
      socketId,
      userId,
    })
  }
}

export default new NotifyService()
