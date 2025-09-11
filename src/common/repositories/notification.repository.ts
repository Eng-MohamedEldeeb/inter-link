import { INotifications } from "../../db/interfaces/INotification.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../services/db/db.service"
import { TNotification } from "../../db/documents"
import { NotificationModel } from "../../db/models/Notification/Notification.model"

class NotificationRepository extends DataBaseService<
  INotifications,
  TNotification
> {
  constructor(
    private readonly notificationModel: Model<TNotification> = NotificationModel,
  ) {
    super(notificationModel)
  }
}

export default new NotificationRepository()
