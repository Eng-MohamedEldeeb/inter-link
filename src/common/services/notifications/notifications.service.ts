import { io } from '../../../main'

import { EventType } from '../../types/ws/events.enum'
import { MongoId } from '../../types/db'
import { TNotification } from '../../../db/documents'
import { INotificationDetails } from '../../../db/interfaces/INotification.interface'

import onlineUsersController from './online-users.controller'
import notificationRepository from '../../repositories/notification.repository'

class NotificationsService {
  protected readonly onlineUsersController = onlineUsersController
  private readonly notificationRepository = notificationRepository
  private readonly eventType = EventType

  protected notificationDetails!: INotificationDetails
  protected currentNotifications!: TNotification

  protected userId!: MongoId
  protected socketId!: string

  public readonly sendNotification = async ({
    toUser,
    notificationDetails,
  }: {
    toUser: MongoId
    notificationDetails: INotificationDetails
  }) => {
    this.userId = toUser
    this.notificationDetails = notificationDetails

    const { socketId, isOnline } = this.onlineUsersController.getStatus(
      this.userId,
    )

    if (!isOnline) return await this.addToMissedNotification()

    this.socketId = socketId

    return await this.send()
  }

  protected readonly addToMissedNotification = async () => {
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

  protected readonly send = async () => {
    const userNotifications = await this.getUserNotifications()

    if (!userNotifications) return await this.createAndSend()

    this.currentNotifications = userNotifications

    return await this.updateAndSend()
  }

  protected readonly createAndSend = async () => {
    const event = this.eventType.notification

    await this.notificationRepository.create({
      belongsTo: this.userId,
      seen: [this.notificationDetails],
    })

    return io.to(this.socketId).emit(event, this.notificationDetails)
  }

  protected readonly updateAndSend = async () => {
    const event = this.eventType.notification

    const { seen } = this.currentNotifications

    const { title, from, refTo, on } = this.notificationDetails

    await this.notificationRepository.findByIdAndUpdate({
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
        ],
      },
    })

    return io.to(this.socketId).emit(event, this.notificationDetails)
  }

  protected readonly getUserNotifications = async () => {
    return await this.notificationRepository.findOne({
      filter: { belongsTo: this.userId },
      projection: { missed: 1, seen: 1 },
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

    if (
      !notifications ||
      (notifications.missed && notifications.missed.length === 0)
    )
      return

    this.currentNotifications = notifications

    return await this.readAll()
  }

  protected readonly readAll = async () => {
    const { _id, missed, seen } = this.currentNotifications
    const event = this.eventType.newNotifications

    for (const notification of missed) {
      io.to(this.socketId).emit(event, notification)
    }

    if (!seen || seen.length == 0)
      return await this.notificationRepository.findByIdAndUpdate({
        _id,
        data: { missed: [], seen: missed },
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
