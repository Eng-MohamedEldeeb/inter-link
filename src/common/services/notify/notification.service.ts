import { ConnectedUser } from "../../../modules/socket-io/user-status/user-status"
import { io } from "../../.."
import { MongoId } from "../../types/db"

import {
  NotificationRefType,
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

class NotificationService {
  private readonly notificationRepository = notificationRepository
  private readonly messageRepository = messageRepository

  public readonly sendNotification = async ({
    sender,
    receiverId,
    body,
  }: TSendNotificationParams) => {
    const { isConnected, socketId } = ConnectedUser.getCurrentStatus(receiverId)

    const { ref } = body

    if (ref === NotificationRefType.Chat)
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
        receivedAt: new Date(Date.now()),
        relatedTo: body.relatedTo,
        ref: body.ref,
      })

    await this.notificationRepository.create({
      sender: sender._id,
      receiver: receiverId,
      sentAt: currentMoment(),
      message: body.message,
      receivedAt: new Date(Date.now()),
      relatedTo: body.relatedTo,
      ref: body.ref,
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
        ref: NotificationRefType.Chat,
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
        ref: NotificationRefType.Chat,
      }),
    ])
  }

  public readonly readNewNotifications = async ({
    receiverId,
    socketId,
  }: TReadNotificationParams) => {
    const missedNotifications = await this.notificationRepository.find({
      filter: {
        receiver: receiverId,
        status: NotificationStatus.sent,
      },
      populate: [
        { path: "totalNotifications" },
        {
          path: "sender",
          select: {
            username: 1,
            "avatar.secure_url": 1,
          },
          options: { lean: true },
        },
      ],
    })

    console.log({ missedNotifications })

    if (missedNotifications.length) {
      missedNotifications.forEach(async notification => {
        if (notification.ref === NotificationRefType.Chat) {
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
}

export default new NotificationService()
