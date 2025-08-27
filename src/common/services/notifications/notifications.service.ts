import { io } from '../../../main'

import { NotificationType } from './types'
import { MongoId } from '../../types/db'
import { TNotification } from '../../../db/documents'

import {
  IMissedMessages,
  INotificationInputs,
  MessageDetails,
  UserDetails,
} from '../../../db/interfaces/INotification.interface'

import connectedUserController from '../../controllers/connected-users.controller'
import notificationRepository from '../../repositories/notification.repository'
import moment from 'moment'

class NotificationsService {
  protected readonly connectedUserController = connectedUserController
  private readonly notificationRepository = notificationRepository
  private readonly notificationType = NotificationType

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

    const { socketId, isOnline } = this.connectedUserController.getUserStatus(
      this.userId,
    )

    if (!isOnline) return await this.addToMissedNotification()

    this.socketId = socketId

    return await this.upsertAndNotify()
  }

  protected readonly upsertAndNotify = async () => {
    const regularNotification = this.notificationType.newNotifications
    const messageNotification = this.notificationType.newMessage

    const refToChat =
      this.notificationDetails.refTo === 'Chat' ||
      this.notificationDetails.refTo === 'Group'

    if (refToChat)
      return io
        .to(this.socketId)
        .emit(messageNotification, this.notificationDetails)

    await this.upsertSeenNotifications()

    return io
      .to(this.socketId)
      .emit(regularNotification, this.notificationDetails)
  }

  protected readonly addToMissedNotification = async () => {
    const { refTo } = this.notificationDetails

    if (refTo === 'Chat' || refTo == 'Group')
      return await this.upsertMissedMessages()

    return await this.upsertMissedNotifications()
  }

  protected readonly upsertMissedMessages = async () => {
    const currentNotifications = await this.getUserNotifications()

    const { from, message, sentAt, messageId, refTo } = this.notificationDetails

    if (!currentNotifications)
      return await this.notificationRepository.create({
        belongsTo: this.userId,
        missedMessages: [{ from, message, sentAt, messageId, refTo }],
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
            'missedMessages.$.messages': { message, sentAt },
          },
        },
      })

    return await this.notificationRepository.findOneAndUpdate({
      filter: {
        belongsTo: this.userId,
      },

      data: {
        $push: {
          missedMessages: { from, messages: [{ message, sentAt }] },
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

    const refToChat =
      this.notificationDetails.refTo === 'Chat' ||
      this.notificationDetails.refTo === 'Group'

    if (refToChat) return

    if (!currentNotifications)
      return await this.notificationRepository.create({
        belongsTo: this.userId,
        seen: [this.notificationDetails],
      })

    const { seen } = currentNotifications

    const { message, from, refTo, on, sentAt } = this.notificationDetails

    return await this.notificationRepository.findByIdAndUpdate({
      _id: currentNotifications._id,
      data: {
        seen: [
          {
            message,
            from,
            refTo,
            ...(on && { on }),
            sentAt,
          },
          ...(seen && seen.length > 0 ? seen : []),
        ],
      },
    })
  }

  protected readonly getUserNotifications = async () => {
    return await this.notificationRepository.findOne({
      filter: { belongsTo: this.userId },
      projection: {
        missed: 1,
        seen: 1,
        missedMessages: 1,
        missedNotifications: 1,
      },
      populate: [
        {
          path: 'missedMessages.from',
          select: {
            _id: 1,
            username: 1,

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
    const newMessage = this.notificationType.newMessage

    for (const messageDetails of missedMessages) {
      const notificationMessage: Pick<
        INotificationInputs,
        'from' | 'message' | 'sentAt' | 'messageId'
      > = {
        from: messageDetails.from,
        message: messageDetails.message,
        messageId: messageDetails.messageId,
        sentAt: messageDetails.sentAt,
      }
      return io.to(this.socketId).emit(newMessage, notificationMessage)
    }
  }

  protected readonly readAllMissedNotifications = (
    missedNotifications: INotificationInputs[],
  ) => {
    const newNotifications = this.notificationType.newNotifications

    for (const notification of missedNotifications) {
      io.to(this.socketId).emit(newNotifications, notification)
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
