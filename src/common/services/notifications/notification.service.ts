import { io } from '../../../main'

import { EventType } from '../../types/ws/events.enum'
import { MongoId } from '../../types/db/db.types'
import { TNotificationDetails } from '../../../db/types/notification.type'
import { TNotification } from '../../../db/types/document.type'

import onlineUsersController from './online-users.controller'
import notificationRepository from '../../repositories/notification.repository'

class NotificationsService {
  private readonly notificationRepository = notificationRepository
  private readonly onlineUsersController = onlineUsersController
  private readonly eventType = EventType

  protected readonly getUserNotifications = async (userId: MongoId) => {
    return await this.notificationRepository.findOne({
      filter: { belongsTo: userId },
      projection: { missed: 1 },
      populate: [
        {
          path: 'missed.from',
          select: {
            _id: 1,
            username: 1,
            fullName: 1,
            'avatar.secure_url': 1,
          },
          options: { lean: true },
        },
        {
          path: 'missed.on',
          select: {
            'attachments.paths.secure_url': 1,
            'attachment.path.secure_url': 1,
            content: 1,
          },

          options: { lean: true },
        },
      ],
    })
  }

  protected readonly emptyOldNotifications = async (
    notification: TNotification,
  ) => {
    const seenNotifications = notification.seen

    const oldMissedNotifications = notification.missed

    return await this.notificationRepository.findByIdAndUpdate({
      _id: notification._id,
      data: {
        $unset: { missed: 1 },
        seen: [
          ...oldMissedNotifications,
          ...((seenNotifications &&
            seenNotifications.length > 0 &&
            seenNotifications) ||
            []),
        ],
      },
    })
  }

  public readonly readMissedNotifications = async ({
    userId,
    socketId,
  }: {
    userId: MongoId
    socketId: string
  }) => {
    const userNotification = await this.getUserNotifications(userId)

    const noMissedNotifications =
      userNotification && userNotification.missed.length == 0

    if (!userNotification || noMissedNotifications) {
      return
    }

    for (const notification of userNotification.missed) {
      const event = this.eventType.missedNotifications
      const id = socketId

      io.to(id).emit(event, notification)
    }

    return await this.emptyOldNotifications(userNotification)
  }

  protected readonly addToMissedNotifications = async ({
    to,
    notification,
  }: {
    to: MongoId
    notification: TNotificationDetails
  }) => {
    const missedNotifications = await this.getUserNotifications(to)

    if (missedNotifications)
      return await this.notificationRepository.findOneAndUpdate({
        filter: { belongsTo: to },
        data: { $push: { missed: notification } },
      })

    return await this.notificationRepository.create({
      belongsTo: to,
      missed: [notification],
    })
  }

  public readonly sendNotification = async ({
    to,
    notification,
  }: {
    to: MongoId
    notification: TNotificationDetails
  }) => {
    const id: string | undefined = this.onlineUsersController.get(to.toString())

    const event = this.eventType.notification

    if (!id) return this.addToMissedNotifications({ to, notification })

    const userNotification = await this.getUserNotifications(to)

    if (userNotification) {
      await this.notificationRepository.findByIdAndUpdate({
        _id: userNotification._id,
        data: {
          seen: [
            {
              ...notification,
              from: notification.from._id,
              ...('on' in notification && { on: notification.on._id }),
            },
            ...((userNotification.seen &&
              userNotification.seen.length > 0 &&
              userNotification.seen) ||
              []),
          ],
        },
      })
      return io.to(id).emit(event, notification)
    }

    await this.notificationRepository.create({
      belongsTo: to,
      seen: [notification],
    })
    return io.to(id).emit(event, notification)
  }
}

export default new NotificationsService()
