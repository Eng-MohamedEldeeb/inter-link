import { io } from '../../../main'

import { EventType } from '../../types/ws/events.enum'
import { MongoId } from '../../types/db'
import { TNotification } from '../../../db/documents'
import { INotificationInputs } from '../../../db/interfaces/INotification.interface'

import onlineUsersController from './online-users.controller'
import notificationRepository from '../../repositories/notification.repository'

class NotificationsService {
  protected readonly onlineUsersController = onlineUsersController
  private readonly notificationRepository = notificationRepository
  private readonly eventType = EventType

  protected notificationDetails!: INotificationInputs
  protected currentNotifications!: TNotification

  protected userId!: MongoId
  protected socketId!: string

  public readonly sendNotification = async ({
    toUser,
    notificationDetails,
  }: {
    toUser: MongoId
    notificationDetails: INotificationInputs
  }) => {
    this.userId = toUser
    this.notificationDetails = notificationDetails

    const { socketId, isOnline } = this.onlineUsersController.getStatus(
      this.userId,
    )

    if (!isOnline) return await this.insertIntoMissedNotification()

    this.socketId = socketId

    return await this.upsertAndNotify()
  }

  protected readonly upsertAndNotify = async () => {
    const event = this.eventType.notification

    await this.upsertSeenNotifications()

    return io.to(this.socketId).emit(event, this.notificationDetails)
  }

  protected readonly insertIntoMissedNotification = async () => {
    const { refTo } = this.notificationDetails

    if (refTo === 'Chat') return await this.upsertMissedMessages()

    return await this.upsertMissedNotifications()
  }

  protected readonly upsertMissedMessages = async () => {
    const currentNotifications = await this.getUserNotifications()

    if (!currentNotifications)
      return await this.notificationRepository.create({
        belongsTo: this.userId,
        missedMessages: [this.notificationDetails],
      })

    return await this.notificationRepository.findOneAndUpdate({
      filter: { belongsTo: this.userId },
      data: { $push: { missedMessages: this.notificationDetails } },
    })
  }

  protected readonly upsertMissedNotifications = async () => {
    const notifications = await this.getUserNotifications()

    if (!notifications)
      return await this.notificationRepository.create({
        belongsTo: this.userId,
        missed: [this.notificationDetails],
      })

    return await this.notificationRepository.findOneAndUpdate({
      filter: { belongsTo: this.userId },
      data: { $push: { missed: this.notificationDetails } },
    })
  }

  protected readonly upsertSeenNotifications = async () => {
    const currentNotifications = await this.getUserNotifications()

    if (!currentNotifications)
      return await this.notificationRepository.create({
        belongsTo: this.userId,
        seen: [this.notificationDetails],
      })

    const { seen } = currentNotifications

    const { title, from, refTo, on, content, sentAt } = this.notificationDetails

    if (refTo === 'Chat') return

    return await this.notificationRepository.findByIdAndUpdate({
      _id: this.currentNotifications._id,
      data: {
        seen: [
          {
            title,
            from,
            refTo,
            ...(on && { on }),
          },
          ...(seen && seen.length > 0 ? seen : []),
          sentAt,
        ],
      },
    })
  }

  protected readonly getUserNotifications = async () => {
    return await this.notificationRepository.findOne({
      filter: { belongsTo: this.userId },
      projection: { missed: 1, seen: 1, missedMessages: 1 },
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

  public readonly readMissedNotifications = async ({
    userId,
    socketId,
  }: {
    userId: MongoId
    socketId: string
  }) => {
    this.userId = userId
    this.socketId = socketId

    const notifications = await this.getUserNotifications()

    console.log({ notifications })

    if (
      !notifications ||
      (notifications.missed.length === 0 &&
        notifications.missedMessages.length === 0)
    )
      return

    this.currentNotifications = notifications

    return await this.readAll()
  }

  protected readonly readAll = async () => {
    const { _id, missed, missedMessages, seen } = this.currentNotifications
    const event = this.eventType.newNotifications

    if (missedMessages.length)
      for (const message of missedMessages) {
        io.to(this.socketId).emit(event, message)
      }

    if (!missed.length)
      return await this.notificationRepository.findByIdAndUpdate({
        _id,
        data: { missedMessages: [] },
        options: { missed: true },
      })

    for (const notification of missed) {
      io.to(this.socketId).emit(event, notification)
    }

    if (!seen || seen.length == 0)
      return await this.notificationRepository.findByIdAndUpdate({
        _id,
        data: { missed: [], missedMessages: [], seen: missed },
        options: { missed: true },
      })

    const updatedSeenList = [
      ...(missed && missed.length > 0 ? missed : []),
      ...(seen && seen.length > 0 ? seen : []),
    ]

    return await this.notificationRepository.findByIdAndUpdate({
      _id,
      data: {
        missed: [],
        seen: updatedSeenList,
      },
      options: { new: true },
    })
  }
}

export default new NotificationsService()
