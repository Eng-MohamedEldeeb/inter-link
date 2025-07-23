import { io } from '../../../main'

import { EventType } from '../../types/ws/events.enum'
import { MongoId } from '../../types/db/db.types'
import { TNotification } from '../../../db/types/document.type'

import onlineUsersController from './online-users.controller'
import notificationRepository from '../../repositories/notification.repository'
import { INotificationDetails } from '../../../db/interface/INotification.interface'

class NotificationsService {
  protected readonly onlineUsersController = onlineUsersController
  private readonly notificationRepository = notificationRepository
  private readonly eventType = EventType

  protected oldNotifications!: TNotification
  protected userId!: MongoId
  protected socketId!: string

  protected readonly getUserNotifications = async () => {
    return await this.notificationRepository.findOne({
      filter: { belongsTo: this.userId },
      projection: { missed: 1, received: 1 },
      populate: [
        {
          path: 'missed.from',
          select: {
            _id: 1,
            username: 1,
            fullName: 1,
            content: 1,
            'avatar.secure_url': 1,
            'attachments.paths.secure_url': 1,
            'attachment.path.secure_url': 1,
          },
          options: { lean: true },
        },
        {
          path: 'missed.on',
          select: {
            _id: 1,
            username: 1,
            fullName: 1,
            content: 1,
            'avatar.secure_url': 1,
            'attachments.paths.secure_url': 1,
            'attachment.path.secure_url': 1,
          },

          options: { lean: true },
        },
      ],
      options: { lean: true },
    })
  }

  protected updateUserNotifications = async (
    notificationDetails: INotificationDetails,
  ) => {
    const { received } = this.oldNotifications
    const { title, from, refTo, on } = notificationDetails

    return await this.notificationRepository.findByIdAndUpdate({
      _id: this.oldNotifications._id,
      data: {
        received: [
          {
            title,
            from,
            refTo,
            ...(on && { on }),
          },
          ...(received && received),
        ],
      },
    })
  }

  protected readonly markAsReceived = async () => {
    const { _id, missed, received } = this.oldNotifications
    console.log({ oldNotifications: this.oldNotifications })

    return await this.notificationRepository.findByIdAndUpdate({
      _id,
      data: {
        $unset: { missed: 1 },
        received: [
          ...missed,
          ...(received && received.length > 0 ? received : []),
        ],
      },
      options: { new: true },
    })
  }

  public readonly readMissedNotifications = async ({
    userId,
    socketId,
  }: {
    userId: MongoId
    socketId: string
  }) => {
    const event = this.eventType.missedNotifications

    this.userId = userId

    const oldNotifications = await this.getUserNotifications()

    if (!oldNotifications) return

    if (oldNotifications.missed.length === 0) return

    this.oldNotifications = oldNotifications

    for (const notification of this.oldNotifications.missed) {
      io.to(socketId).emit(event, notification)
    }

    return await this.markAsReceived()
  }

  protected readonly addToMissedNotifications = async (
    notificationDetails: INotificationDetails,
  ) => {
    const notifications = await this.getUserNotifications()

    if (!notifications)
      return await this.notificationRepository.create({
        belongsTo: this.userId,
        missed: [notificationDetails],
      })

    return await this.notificationRepository.findOneAndUpdate({
      filter: { belongsTo: this.userId },
      data: { $push: { missed: notificationDetails } },
    })
  }

  public readonly sendNotification = async ({
    toUser,
    notificationDetails,
  }: {
    toUser: MongoId
    notificationDetails: INotificationDetails
  }) => {
    this.userId = toUser
    const event = this.eventType.notification

    const socketId = this.onlineUsersController.getSocketId(
      this.userId.toString(),
    )

    if (!socketId)
      return await this.addToMissedNotifications(notificationDetails)

    this.socketId = socketId

    const userNotifications = await this.getUserNotifications()

    if (!userNotifications) {
      await this.notificationRepository.create({
        belongsTo: this.userId,
        received: [notificationDetails],
      })

      return io.to(this.socketId).emit(event, notificationDetails)
    }

    await this.updateUserNotifications(notificationDetails)

    return io.to(this.socketId).emit(event, notificationDetails)
  }
}

export default new NotificationsService()
