import notificationRepository from '../../common/repositories/notification.repository'

import * as DTO from './dto/notification.dto'

import { throwError } from '../../common/handlers/error-message.handler'
import { MongoId } from '../../common/types/db'

export class NotificationService {
  protected static readonly notificationRepository = notificationRepository

  public static readonly getAllNotifications = async (profileId: MongoId) => {
    const notifications = await this.notificationRepository.findOne({
      filter: { belongsTo: profileId },
    })

    if (!notifications)
      return {
        notifications: null,
        totalMissedNotifications: 0,
      }

    return {
      notifications: {
        missedNotifications: notifications.missedNotifications,
        seen: notifications.seen,
      },
      totalMissedNotifications: notifications.totalMissedNotifications,
    }
  }

  public static readonly deleteNotification = async ({
    profileId,
    id,
  }: DTO.IDeleteNotifications) => {
    const isDeleted = await this.notificationRepository.findOneAndUpdate({
      filter: {
        belongsTo: profileId,
      },
      data: { $pull: { seen: id, missed: id } },
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
