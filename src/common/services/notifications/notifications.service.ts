import { io } from '../../../main'

import { EventType } from '../../types/ws/events.enum'
import { MongoId } from '../../types/db'
import { TNotification } from '../../../db/documents'

import {
  IMissedMessages,
  INotificationInputs,
  MessageDetails,
  UserDetails,
} from '../../../db/interfaces/INotification.interface'

import onlineUsersController from './online-users.controller'
import notificationRepository from '../../repositories/notification.repository'
import moment from 'moment'

class NotificationsService {
  protected readonly onlineUsersController = onlineUsersController
  private readonly notificationRepository = notificationRepository
  private readonly eventType = EventType

  protected notificationDetails!: INotificationInputs
  protected currentNotifications!: TNotification

  protected userId!: MongoId
  protected socketId!: string

  public readonly sendNotification = async ({
    userId,
    notificationDetails,
  }: {
    userId: MongoId
    notificationDetails: INotificationInputs
  }) => {
    this.userId = userId
    this.notificationDetails = notificationDetails

    const { socketId, isOnline } = this.onlineUsersController.getStatus(
      this.userId,
    )

    if (!isOnline) return await this.addToMissedNotification()

    this.socketId = socketId

    return await this.upsertAndNotify()
  }

  protected readonly upsertAndNotify = async () => {
    const event = this.eventType.notification

    await this.upsertSeenNotifications()

    return io.to(this.socketId).emit(event, this.notificationDetails)
  }

  protected readonly addToMissedNotification = async () => {
    const { refTo } = this.notificationDetails

    if (refTo === 'Chat') return await this.upsertMissedMessages()

    return await this.upsertMissedNotifications()
  }

  protected readonly upsertMissedMessages = async () => {
    const currentNotifications = await this.getUserNotifications()

    const { from, notificationMessage, sentAt } = this.notificationDetails

    if (!currentNotifications)
      return await this.notificationRepository.create({
        belongsTo: this.userId,
        missedMessages: [{ from, messages: [{ notificationMessage, sentAt }] }],
      })

    const includesUserMissedMessages = currentNotifications.missedMessages.some(
      messageDetails => messageDetails.from._id.equals(from._id),
    )

    if (includesUserMissedMessages)
      return await this.notificationRepository.findOneAndUpdate({
        filter: {
          $and: [{ belongsTo: this.userId }, { 'missedMessages.from': from }],
        },

        data: {
          $push: {
            'missedMessages.$.messages': { notificationMessage, sentAt },
          },
        },
      })

    return await this.notificationRepository.findOneAndUpdate({
      filter: {
        belongsTo: this.userId,
      },

      data: {
        $push: {
          missedMessages: { from, messages: [{ notificationMessage, sentAt }] },
        },
      },
    })
  }

  protected readonly upsertMissedNotifications = async () => {
    const notifications = await this.getUserNotifications()

    if (!notifications)
      return await this.notificationRepository.create({
        belongsTo: this.userId,
        missedNotifications: [this.notificationDetails],
      })

    return await this.notificationRepository.findOneAndUpdate({
      filter: { belongsTo: this.userId },
      data: { $push: { missedNotifications: this.notificationDetails } },
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

    const { notificationMessage, from, refTo, on, sentAt } =
      this.notificationDetails

    if (refTo === 'Chat') return

    return await this.notificationRepository.findByIdAndUpdate({
      _id: this.currentNotifications._id,
      data: {
        seen: [
          {
            notificationMessage,
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
          path: 'missedMessages.from',
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
          path: 'missedNotifications.from',
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
          path: 'missedNotifications.on',
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
      (notifications.missedNotifications.length === 0 &&
        notifications.missedMessages.length === 0)
    )
      return

    this.currentNotifications = notifications

    return await this.readAll()
  }

  protected readonly readAll = async () => {
    const {
      _id: notificationId,
      missedNotifications,
      missedMessages,
      seen,
    } = this.currentNotifications

    if (missedMessages.length) this.reaAllMissedMessages(missedMessages)

    if (missedNotifications.length) {
      this.readAllMissedNotifications(missedNotifications)

      return await this.updateSeenNotifications({
        missedNotifications,
        notificationId,
        seen,
      })
    }

    return await this.notificationRepository.findByIdAndUpdate({
      _id: notificationId,
      data: { missedMessages: [] },
      options: { new: true },
    })
  }

  protected readonly reaAllMissedMessages = (
    missedMessages: IMissedMessages[],
  ) => {
    const event = this.eventType.newNotifications

    for (const messageDetails of missedMessages) {
      const { from, messages } = messageDetails
      const userDetails = from as UserDetails

      if (messages.length > 1) {
        const message: MessageDetails = {
          from,
          notificationMessage: `${userDetails.username} sent you ${messageDetails.messages.length} messages`,
          sentAt: moment().format('h:mm A'),
        }
        return io.to(this.socketId).emit(event, message)
      }

      const message: Pick<
        INotificationInputs,
        'from' | 'notificationMessage' | 'sentAt'
      > = {
        from,
        notificationMessage: messageDetails.messages[0].notificationMessage,
        sentAt: messageDetails.messages[0].sentAt,
      }
      return io.to(this.socketId).emit(event, message)
    }
  }

  protected readonly readAllMissedNotifications = (
    missedNotifications: INotificationInputs[],
  ) => {
    const event = this.eventType.newNotifications

    for (const notification of missedNotifications) {
      io.to(this.socketId).emit(event, notification)
    }
  }

  protected readonly updateSeenNotifications = async ({
    notificationId,
    seen,
    missedNotifications,
  }: {
    notificationId: MongoId
    seen: INotificationInputs[]
    missedNotifications: INotificationInputs[]
  }) => {
    if (!seen || seen.length == 0)
      return await this.notificationRepository.findByIdAndUpdate({
        _id: notificationId,
        data: {
          missedNotifications: [],
          missedMessages: [],
          seen: missedNotifications,
        },
        options: { new: true },
      })

    const updatedSeenList = [
      ...(missedNotifications && missedNotifications.length > 0
        ? missedNotifications
        : []),
      ...(seen && seen.length > 0 ? seen : []),
    ]

    return await this.notificationRepository.findByIdAndUpdate({
      _id: notificationId,
      data: {
        missedNotifications: [],
        seen: updatedSeenList,
      },
      options: { new: true },
    })
  }
}

export default new NotificationsService()
