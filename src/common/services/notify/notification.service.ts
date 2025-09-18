import { ConnectedUser } from "../../../modules/socket-io/user-status/user-status"
import { io } from "../../.."
import { MongoId } from "../../types/db"

import {
  NotificationRefTo,
  NotificationStatus,
} from "../../../db/interfaces/INotification.interface"

import {
  NotificationType,
  TReadNotificationParams,
  TSendNotificationParams,
} from "./types"
import {
  messageRepository,
  notificationRepository,
} from "../../../db/repositories"
import { currentMoment } from "../../decorators/moment/moment"
import { MessageStatus } from "../../../db/interfaces/IMessage.interface"
import notificationService from "../../../modules/apis/notification/notification.service"

class NotificationService {
  private readonly notificationRepository = notificationRepository
  private readonly notificationService = notificationService
  private readonly messageRepository = messageRepository

  public readonly sendNotification = async ({
    sender,
    receiverId,
    body,
  }: TSendNotificationParams) => {
    const { isConnected, socketId } = ConnectedUser.getCurrentStatus(receiverId)

    const { refTo } = body

    if (refTo === NotificationRefTo.Chat)
      return await this.sendMessageNotification({
        sender,
        receiverId,
        body,
      })

    if (!isConnected)
      return await this.notificationRepository.create({
        sender: sender._id,
        sentAt: currentMoment(),
        message: body.message,
        receiver: receiverId,
        receivedAt: new Date(Date.now()),
        relatedTo: body.relatedTo,
        refTo: body.refTo,
      })

    await this.notificationRepository.create({
      sender: sender._id,
      receiver: receiverId,
      sentAt: currentMoment(),
      message: body.message,
      receivedAt: new Date(Date.now()),
      relatedTo: body.relatedTo,
      refTo: body.refTo,
    })

    return io
      .to(socketId)
      .emit(NotificationType.newNotification, { sender, body })
  }

  private readonly sendMessageNotification = ({
    sender,
    receiverId,
    body,
  }: TSendNotificationParams) => {
    const { isConnected, socketId } = ConnectedUser.getCurrentStatus(receiverId)

    console.log({ isConnected })

    if (isConnected) {
      this.notificationRepository.create({
        sender: sender._id,
        receiver: receiverId,
        sentAt: currentMoment(),
        message: body.message,
        receivedAt: new Date(Date.now()),
        relatedTo: body.relatedTo,
        refTo: NotificationRefTo.Chat,
      })

      return io.to(socketId).emit(NotificationType.newMessage, { sender, body })
    }

    return Promise.allSettled([
      this.messageRepository.create({
        sender: sender._id,
        receiver: receiverId,
        sentAt: currentMoment(),
        message: body.message,
        status: MessageStatus.sent,
        chatId: body.relatedTo,
      }),

      this.notificationRepository.create({
        sender: sender._id,
        receiver: receiverId,
        sentAt: currentMoment(),
        message: body.message,
        relatedTo: body.relatedTo,
        refTo: NotificationRefTo.Chat,
      }),
    ])
  }

  public readonly readNewNotifications = async ({
    receiverId,
    socketId,
  }: TReadNotificationParams) => {
    const missedNotifications =
      await this.notificationService.getUserNotifications(receiverId, {
        status: NotificationStatus.sent,
        sorted: false,
      })

    console.log({ missedNotifications })

    if (missedNotifications.length) {
      missedNotifications.forEach(async notification => {
        if (notification.refTo === NotificationRefTo.Chat) {
          // notification.status = NotificationStatus.received

          // notification.save()

          return io.to(socketId).emit(NotificationType.newMessage, {
            message: notification.message,
            sentAt: notification.sentAt,
            sender: notification.sender,
          })
        }

        return io.to(socketId).emit(NotificationType.newNotification, {
          message: notification.message,
          sentAt: notification.sentAt,
          sender: notification.sender,
        })
      })
    }
  }

  public readonly markAsReadNotifications = async (receiverId: MongoId) => {
    const missedNotifications = await this.notificationRepository.find({
      filter: { receiver: receiverId, status: NotificationStatus.sent },
    })

    console.log({ missedNotifications })
  }
}

export default new NotificationService()
