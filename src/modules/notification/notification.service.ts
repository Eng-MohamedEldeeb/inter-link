import { throwError } from '../../common/handlers/error-message.handler'
import { MongoId } from '../../common/types/db/db.types'

import * as DTO from './dto/notification.dto'

import notificationRepository from '../../common/repositories/notification.repository'

export class NotificationService {
  private static readonly notificationRepository = notificationRepository

  static readonly getAllNotifications = async (profileId: MongoId) => {
    const notifications = await this.notificationRepository.findOne({
      filter: { belongsTo: profileId },
    })

    if (!notifications)
      return {
        notifications: null,
        totalReceivedNotifications: 0,
      }

    return {
      notifications: {
        received: notifications.received,
        seen: notifications.seen,
      },
      totalReceivedNotifications: notifications.totalReceivedNotifications,
    }
  }

  static readonly deleteNotification = async ({
    profileId,
    id,
  }: DTO.IDeleteNotifications) => {
    const isDeleted = await this.notificationRepository.findOneAndUpdate({
      filter: {
        belongsTo: profileId,
      },
      data: { $pull: { seen: id, received: id } },
    })

    return (
      isDeleted ??
      throwError({
        msg: "In-valid Notification id or Notification doesn't exist",
        status: 404,
      })
    )
  }
}
