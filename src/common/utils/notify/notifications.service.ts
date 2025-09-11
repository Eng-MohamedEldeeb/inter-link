import { io } from "../../.."
import { NotificationType } from "./types"
import { MongoId } from "../../types/db"

import {
  IMissedMessages,
  INotificationInputs,
  INotifications,
} from "../../../db/interfaces/INotification.interface"

import userService from "../../../modules/user/user.service"
import notificationService from "../../../modules/notification/notification.service"
import notificationRepository from "../../repositories/notification.repository"

class NotificationsService {
  private readonly userService = userService
  private readonly notificationService = notificationService

  private readonly notificationRepository = notificationRepository

  private notificationDetails!: INotificationInputs
  private currentNotifications!: INotifications

  private userId!: MongoId
  private socketId!: string

  public readonly sendNotification = async ({
    userId,
    notificationDetails,
  }: {
    userId: MongoId
    notificationDetails: INotificationInputs
  }) => {
    this.userId = userId
    this.notificationDetails = notificationDetails
    const userStatus = this.userService.getCurrentStatus(this.userId)

    if (!userStatus.isConnected) return await this.addToMissed()

    this.socketId = userStatus.socketId

    return await this.upsertAndNotify()
  }

  private readonly upsertAndNotify = async () => {
    const { refTo } = this.notificationDetails

    const messageNotification = refTo === "Chat" || refTo === "Group"

    if (messageNotification)
      return io
        .to(this.socketId)
        .emit(NotificationType.newMessage, this.notificationDetails)

    await this.upsertNewNotification()

    return io
      .to(this.socketId)
      .emit(NotificationType.newNotification, this.notificationDetails)
  }

  private readonly upsertNewNotification = async () => {
    const { on } = this.notificationDetails

    const { notifications } =
      await this.notificationService.getUserNotifications(this.userId)

    if (!notifications)
      return await this.notificationRepository.create({
        belongsTo: this.userId,
        newNotifications: [this.notificationDetails],
      })

    return await this.notificationRepository.findByIdAndUpdate({
      _id: notifications._id,
      data: {
        newNotifications: [
          {
            ...this.notificationDetails,
            ...(on && { on }),
          },
          ...notifications.newNotifications,
        ],
      },
    })
  }

  private readonly addToMissed = async () => {
    const { refTo } = this.notificationDetails

    if (refTo === "Chat" || refTo == "Group")
      return await this.upsertNewMessage()

    return await this.upsertNewNotification()
  }

  private readonly upsertNewMessage = async () => {}

  public readonly readMissedNotifications = async ({
    userId,
    socketId,
  }: {
    userId: MongoId
    socketId: string
  }) => {
    this.userId = userId
    this.socketId = socketId

    const notifications = await this.getNewNotifications(this.userId)

    if (notifications) {
      const { newMessages, newNotifications, seen } = notifications

      if (newMessages.length) this.reaAllMissedMessages(newMessages)

      if (newNotifications.length) {
        this.readAllMissedNotifications(newNotifications)

        return await this.updateCaughtNotifications({
          newNotifications,
          notificationId: notifications._id,
          seen,
        })
      }

      return await this.notificationRepository.findByIdAndUpdate({
        _id: notifications._id,
        data: { newMessages: [] },
        options: { new: true },
      })

      // return await this.readAll()
    }

    return
  }

  public readonly getNewNotifications = async (profileId: MongoId) => {
    return await this.notificationRepository.findOne({
      filter: { belongsTo: profileId },
      projection: {
        missed: 1,
        seen: 1,
        newMessages: 1,
        newNotifications: 1,
      },
      populate: [
        {
          path: "newMessages.from",
          select: {
            _id: 1,
            username: 1,
            content: 1,
            "avatar.secure_url": 1,
            "attachments.paths.secure_url": 1,
            "attachment.path.secure_url": 1,
          },
          options: { lean: true },
        },
        {
          path: "newNotifications.from",
          select: {
            _id: 1,
            username: 1,
            content: 1,
            "avatar.secure_url": 1,
            "attachments.paths.secure_url": 1,
            "attachment.path.secure_url": 1,
          },
          options: { lean: true },
        },
        {
          path: "newNotifications.on",
          select: {
            _id: 1,
            username: 1,
            content: 1,
            "avatar.secure_url": 1,
            "attachments.paths.secure_url": 1,
            "attachment.path.secure_url": 1,
          },

          options: { lean: true },
        },
      ],
      options: { lean: true },
    })
  }

  private readonly readAll = async () => {
    const {
      _id: notificationId,
      newNotifications,
      newMessages,
      seen,
    } = this.currentNotifications

    if (newMessages.length) this.reaAllMissedMessages(newMessages)

    if (newNotifications.length) {
      this.readAllMissedNotifications(newNotifications)

      return await this.updateCaughtNotifications({
        newNotifications,
        notificationId,
        seen,
      })
    }

    return await this.notificationRepository.findByIdAndUpdate({
      _id: notificationId,
      data: { newMessages: [] },
      options: { new: true },
    })
  }

  private readonly reaAllMissedMessages = (newMessages: IMissedMessages[]) => {
    for (const messageDetails of newMessages) {
      const notificationMessage: Pick<
        INotificationInputs,
        "from" | "message" | "sentAt" | "messageId" | "attachment"
      > = {
        from: messageDetails.from,
        message: messageDetails.message,
        messageId: messageDetails.messageId,
        attachment: messageDetails.attachment,
        sentAt: messageDetails.sentAt,
      }
      io.to(this.socketId).emit(
        NotificationType.newMessage,
        notificationMessage,
      )
    }
  }

  private readonly readAllMissedNotifications = (
    newNotifications: INotificationInputs[],
  ) => {
    for (const notification of newNotifications) {
      io.to(this.socketId).emit(NotificationType.newNotification, notification)
    }
  }

  private readonly updateCaughtNotifications = async ({
    notificationId,
    seen,
    newNotifications,
  }: {
    notificationId: MongoId
    seen: INotificationInputs[]
    newNotifications: INotificationInputs[]
  }) => {
    if (!seen || seen.length == 0)
      return await this.notificationRepository.findByIdAndUpdate({
        _id: notificationId,
        data: {
          newNotifications: [],
          newMessages: [],
          seen: newNotifications,
        },
        options: { new: true },
      })

    let caughtNotifications: INotificationInputs[] = []

    if (newNotifications && newNotifications.length > 0)
      caughtNotifications = caughtNotifications.concat(newNotifications)

    if (seen && seen.length > 0)
      caughtNotifications = caughtNotifications.concat(seen)

    return await this.notificationRepository.findByIdAndUpdate({
      _id: notificationId,
      data: {
        newNotifications: [],
        seen: caughtNotifications,
      },
      options: { new: true },
    })
  }
}

export default new NotificationsService()
