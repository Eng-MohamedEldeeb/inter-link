import { io } from "../../.."
import { ConnectedUser } from "../../../modules/socket-io/user-status/user-status"
import { MongoId } from "../../types/db"
import { currentMoment } from "../../decorators/moment/moment"
import { MessageStatus } from "../../../db/interfaces/IMessage.interface"
import { IPost } from "../../../db/interfaces/IPost.interface"
import { IComment } from "../../../db/interfaces/IComment.interface"
import { IUser } from "../../../db/interfaces/IUser.interface"
import { User } from "../../../db/models"

import {
  INotificationInputs,
  InteractionType,
  NotificationStatus,
} from "../../../db/interfaces/INotification.interface"

import {
  NotificationDetails,
  NotificationType,
  TReadNotificationParams,
  TSendNotificationParams,
} from "./types"

import {
  chatRepository,
  notificationRepository,
} from "../../../db/repositories"

import notificationService from "../../../modules/apis/notification/notification.service"

class NotificationService {
  private readonly notificationRepository = notificationRepository
  private readonly notificationService = notificationService
  private readonly chatRepository = chatRepository

  public readonly sendNotification = async ({
    sender,
    receiver,
    body,
  }: TSendNotificationParams) => {
    const { isConnected, socketId } = ConnectedUser.getCurrentStatus(receiver)

    const { interactionType } = body

    console.log({ interactionType })

    if (interactionType === InteractionType.newLike)
      return await this.upsertNewLike({
        timestamp: this.setTimeStamp({ isConnected, body }),
        socketId,
        data: {
          sender,
          receiver,
          body,
        },
      })

    if (interactionType === InteractionType.newReply)
      return await this.upsertNewReply({
        timestamp: this.setTimeStamp({ isConnected, body }),
        socketId,
        data: {
          sender,
          receiver,
          body,
        },
      })

    if (interactionType === InteractionType.newFollow)
      return await this.upsertNewFollow({
        timestamp: this.setTimeStamp({ isConnected, body }),
        socketId,
        data: {
          sender,
          receiver,
          body,
        },
      })

    if (interactionType === InteractionType.newMessage)
      return io.to(socketId).emit(NotificationType.newMessage, {
        sender,
        body: {
          message: body.message,
          sentAt: body.sentAt,
        },
      })
  }

  private readonly setTimeStamp = ({
    isConnected,
    body,
  }: {
    isConnected: boolean
    body: Omit<
      INotificationInputs,
      "receiver" | "sender" | "likedBy" | "followedBy" | "status"
    >
  }) => {
    if (isConnected)
      return {
        receivedAt: new Date(Date.now()),
        sentAt: body.sentAt,
        status: NotificationStatus.received,
      }
    return {
      sentAt: body.sentAt,
      status: NotificationStatus.sent,
    }
  }

  private readonly upsertNewLike = async ({
    data,
    timestamp,
    socketId,
  }: NotificationDetails) => {
    const { sender, receiver, body } = data

    const existedDocument = await this.notificationRepository.findOne({
      filter: {
        $and: [
          { interactionType: InteractionType.newLike },
          { $or: [{ onPost: body.onPost }, { onComment: body.onComment }] },
        ],
      },
      projection: {
        likedBy: 1,
        onPost: 1,
        onComment: 1,
      },
      populate: [
        {
          path: "onPost",
          select: <Record<keyof IPost, number>>{
            attachments: 1,
            title: 1,
            body: 1,
          },
        },
        {
          path: "onComment",
          select: <Record<keyof IComment, number>>{
            attachment: 1,
            body: 1,
          },
        },
      ],
    })

    if (existedDocument) {
      await this.notificationRepository.findByIdAndUpdate({
        _id: existedDocument._id,
        data: {
          $addToSet: {
            likedBy: sender._id,
          },
          ...timestamp,
        },
      })

      return (
        timestamp.status === NotificationStatus.received &&
        io.to(socketId).emit(NotificationType.newNotification, {
          sender,
          body: {
            message: "liked your content 🩵",
            ...(existedDocument.onPost && { onPost: existedDocument.onPost }),
            ...(existedDocument.onComment && {
              onComment: existedDocument.onComment,
            }),
            sentAt: body.sentAt,
          },
        })
      )
    }

    if (!existedDocument) {
      const createdDocument = await this.notificationRepository.create({
        sender: sender._id,
        receiver: receiver._id,
        likedBy: [sender._id!],
        ...(body.onPost && { onPost: body.onPost }),
        ...(body.onComment && {
          onComment: body.onComment,
        }),

        interactionType: InteractionType.newLike,
        ...timestamp,
      })

      return (
        timestamp.status === NotificationStatus.received &&
        io.to(socketId).emit(NotificationType.newNotification, {
          sender,
          body: {
            message: "liked your content 🩵",
            ...(createdDocument.onPost && { onPost: createdDocument.onPost }),
            ...(createdDocument.onComment && {
              onComment: createdDocument.onComment,
            }),
            sentAt: body.sentAt,
          },
        })
      )
    }
  }

  private readonly upsertNewReply = async ({
    timestamp,
    data,
    socketId,
  }: NotificationDetails) => {
    const { sender, receiver, body } = data

    const createdDocument = await this.notificationRepository.create({
      sender: sender._id,
      receiver: receiver._id,
      repliedWith: body.repliedWith,
      ...(body.onPost && { onPost: body.onPost }),
      ...(body.onComment && {
        onComment: body.onComment,
      }),

      interactionType: InteractionType.newReply,
      ...timestamp,
    })

    return (
      timestamp.status === NotificationStatus.received &&
      io.to(socketId).emit(NotificationType.newNotification, {
        sender,
        body: {
          message: "replied to your content 💚",
          ...(createdDocument.onPost && { onPost: createdDocument.onPost }),
          ...(createdDocument.onComment && {
            onComment: createdDocument.onComment,
          }),
          sentAt: body.sentAt,
        },
      })
    )
  }

  private readonly upsertNewFollow = async ({
    timestamp,
    data,
    socketId,
  }: NotificationDetails) => {
    const { sender, receiver, body } = data
    await this.notificationRepository.create({
      sender: sender._id,
      receiver: receiver._id,
      followedBy: sender._id,

      interactionType: InteractionType.newFollow,
      ...timestamp,
    })

    return (
      timestamp.status === NotificationStatus.received &&
      io.to(socketId).emit(NotificationType.newNotification, {
        sender,
        body: {
          message: "followed you 🧡",
          followedBy: sender._id,
          sentAt: body.sentAt,
        },
      })
    )
  }

  public readonly readNewNotifications = async ({
    receiver,
    socketId,
  }: TReadNotificationParams) => {
    const missedNotifications =
      await this.notificationService.getUserNotifications(receiver, {
        status: NotificationStatus.sent,
        sorted: false,
      })

    const missedMessages = await this.chatRepository.find({
      filter: {
        $or: [{ startedBy: receiver }, { participants: receiver }],
      },
      populate: [
        {
          path: "newMessages",
          match: {
            sender: { $ne: receiver },
            status: MessageStatus.sent,
          },
          options: {
            populate: [
              {
                path: "sender",
                model: User.Model,
              },
            ],
          },
        },
      ],
    })

    missedMessages.forEach(missedMessage => {
      if (missedMessage.newMessages.length) {
        const sender = missedMessage.newMessages[0].sender as Pick<
          IUser,
          "_id" | "avatar" | "username"
        >

        missedMessage.newMessages.forEach(message => {
          console.log({ message })

          if (!message.receivedAt) {
            message.receivedAt = new Date(Date.now())
            message.status = MessageStatus.received
            message.save()
          }
        })

        if (missedMessage.newMessages.length > 1)
          return io.to(socketId).emit(NotificationType.newMessage, {
            sender: missedMessage.newMessages[0].sender,
            body: {
              message: `sent you ${missedMessage.newMessages.length} messages 💬`,
              sentAt: currentMoment(),
            },
          })

        return io.to(socketId).emit(NotificationType.newMessage, {
          sender,
          body: {
            message: missedMessage.newMessages[0].message,
            sentAt: missedMessage.newMessages[0].sentAt,
          },
        })
      }
    })

    missedNotifications.notifications.forEach(notification => {
      const sender = notification.sender as Pick<
        IUser,
        "_id" | "avatar" | "username"
      >

      // TODO
      // notification.receivedAt = new Date(Date.now())
      // notification.status = NotificationStatus.received
      // notification.save()

      if (notification.interactionType === InteractionType.newLike)
        return io.to(socketId).emit(NotificationType.newNotification, {
          sender,
          body: {
            message: "liked your content 🩵",
            ...(notification.onPost && { onPost: notification.onPost }),
            ...(notification.onComment && {
              onComment: notification.onComment,
            }),
            sentAt: notification.sentAt,
          },
        })

      if (notification.interactionType === InteractionType.newReply)
        return io.to(socketId).emit(NotificationType.newNotification, {
          sender,
          body: {
            message: "replied to your content 💚",
            repliedWith: notification.repliedWith,
            ...(notification.onPost && { onPost: notification.onPost }),
            ...(notification.onComment && {
              onComment: notification.onComment,
            }),
            sentAt: notification.sentAt,
          },
        })

      return io.to(socketId).emit(NotificationType.newNotification, {
        sender,
        body: {
          message: "followed you 🧡",
          followedBy: notification.followedBy,
          sentAt: notification.sentAt,
        },
      })
    })
  }

  public readonly markAsReadNotifications = async (receiverId: MongoId) => {
    const missedNotifications = await this.notificationRepository.find({
      filter: { receiver: receiverId, status: NotificationStatus.sent },
    })

    console.log({ missedNotifications })
  }
}

export default new NotificationService()
