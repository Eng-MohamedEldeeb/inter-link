import { INotifications } from '../../db/interface/INotification.interface'
import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TNotification } from '../../db/types/document.type'
import { NotificationModel } from '../../db/models/Notification/Notification.model'

class NotificationRepository extends DataBaseService<
  INotifications,
  TNotification
> {
  constructor(
    protected readonly notificationModel: Model<TNotification> = NotificationModel,
  ) {
    super(notificationModel)
  }
}

export default new NotificationRepository()
