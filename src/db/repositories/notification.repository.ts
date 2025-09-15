import { INotification } from "../../db/interfaces/INotification.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../db.service"
import { TNotification } from "../../db/documents"
import { Notification } from "../models"

class NotificationRepository extends DataBaseService<
  INotification,
  TNotification
> {
  constructor(
    private readonly notificationModel: Model<TNotification> = Notification.Model,
  ) {
    super(notificationModel)
  }
}

export default new NotificationRepository()
