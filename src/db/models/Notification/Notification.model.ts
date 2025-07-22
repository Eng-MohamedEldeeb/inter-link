import { model, models } from 'mongoose'
import { NotificationSchema } from './Notification.schema'

export const NotificationModel =
  models.Notification ?? model('Notification', NotificationSchema)
