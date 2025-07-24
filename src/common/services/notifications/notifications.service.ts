import { io } from '../../../main'

import { EventType } from '../../types/ws/events.enum'
import { MongoId } from '../../types/db/db.types'
import { TNotification } from '../../../db/types/document.type'
import { INotificationDetails } from '../../../db/interface/INotification.interface'

import onlineUsersController from './online-users.controller'
import notificationRepository from '../../repositories/notification.repository'

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
      projection: { received: 1, seen: 1 },
      populate: [
        {
          path: 'received.from',
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
          path: 'received.on',
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
    notificationDetails: Omit<
      INotificationDetails,
      '__v' | 'updatedAt' | 'createdAt' | '_id'
    >,
  ) => {
    const { seen } = this.oldNotifications

    console.log({ updateUserNotifications: this.oldNotifications })

    const { title, from, refTo, on } = notificationDetails

    return await this.notificationRepository.findByIdAndUpdate({
      _id: this.oldNotifications._id,
      data: {
        seen: [
          {
            title,
            from,
            refTo,
            ...(on && { on }),
          },
          ...(seen && seen.length > 0 ? seen : []),
        ],
      },
    })
  }

  protected readonly markAsSeen = async () => {
    const { _id, received, seen } = this.oldNotifications

    console.log({ markAsSeen: this.oldNotifications })

    return await this.notificationRepository.findByIdAndUpdate({
      _id,
      data: {
        $unset: { received: 1 },
        seen: [...received, ...(seen && seen.length > 0 ? seen : [])],
      },
      options: { received: true },
    })
  }

  public readonly readReceivedNotifications = async ({
    userId,
    socketId,
  }: {
    userId: MongoId
    socketId: string
  }) => {
    const event = this.eventType.newNotifications

    this.userId = userId

    const oldNotifications = await this.getUserNotifications()

    if (!oldNotifications) return

    if (oldNotifications.received.length === 0) return

    this.oldNotifications = oldNotifications

    console.log({ readReceivedNotifications: this.oldNotifications })

    for (const notification of this.oldNotifications.received) {
      io.to(socketId).emit(event, notification)
    }

    return await this.markAsSeen()
  }

  protected readonly addToReceivedNotifications = async (
    notificationDetails: INotificationDetails,
  ) => {
    const notifications = await this.getUserNotifications()

    if (!notifications)
      return await this.notificationRepository.create({
        belongsTo: this.userId,
        received: [notificationDetails],
      })

    return await this.notificationRepository.findOneAndUpdate({
      filter: { belongsTo: this.userId },
      data: { $push: { received: notificationDetails } },
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
      return await this.addToReceivedNotifications(notificationDetails)

    this.socketId = socketId

    const userNotifications = await this.getUserNotifications()

    if (!userNotifications) {
      await this.notificationRepository.create({
        belongsTo: this.userId,
        seen: [notificationDetails],
      })

      return io.to(this.socketId).emit(event, notificationDetails)
    }

    this.oldNotifications = userNotifications

    await this.updateUserNotifications(notificationDetails)

    return io.to(this.socketId).emit(event, notificationDetails)
  }
}

export default new NotificationsService()
