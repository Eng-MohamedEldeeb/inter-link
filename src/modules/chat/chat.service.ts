import { Server } from 'socket.io'
import { ISocket } from '../../common/interface/ISocket.interface'
import { EventType } from '../../common/types/ws/events.enum'
import { MongoId } from '../../common/types/db'
import { UserStatus } from '../../common/services/notifications/types'

import * as DTO from './dto/chat.dto'

import moment from 'moment'
import chatRepository from '../../common/repositories/chat.repository'
import connectedUsers from './../../common/services/notifications/online-users.controller'
import notificationsService from '../../common/services/notifications/notifications.service'
import { IChat } from '../../db/interfaces/IChat.interface'

export class ChatService {
  protected static readonly chatRepository = chatRepository
  protected static readonly notificationService = notificationsService

  protected static profileId: MongoId

  protected static userId: MongoId
  protected static userSocketId: string
  protected static userStatus: UserStatus

  protected static chat: [string, string]

  public static readonly sendMessage = async (io: Server) => {
    return async (socket: ISocket) => {
      const { _id: profileId } = socket.profile
      const { _id: userId } = socket.user

      const communicationType1 = `${profileId}:${userId}`
      const communicationType2 = `${userId}:${profileId}`

      this.profileId = profileId
      this.userId = userId
      this.chat = [communicationType1, communicationType2]

      const userStatus = connectedUsers.getStatus(this.userId)

      this.userStatus = userStatus

      connectedUsers.joinChat({ profileId, chat: this.chat })

      socket.join(this.chat)

      socket.on('send-message', async ({ message }: { message: string }) => {
        await this.upsertChatMessage(message)

        console.log({ userStatus: connectedUsers.getStatus(this.userId) })

        const data: DTO.ISendMessage = {
          message,
          sentAt: moment().format('h:mm A'),
          from: socket.profile,
        }

        if (!this.isInChat()) {
          await this.notificationService.sendNotification({
            toUser: this.userId,
            notificationDetails: {
              from: socket.profile,
              title: `${socket.profile.username} sent you a message ✉️`,
              refTo: 'Chat',
              content: message,
              sentAt: moment().format('h:mm A'),
            },
          })
          return io.to(this.userSocketId).emit(EventType.notification, data)
        }

        return socket.to(this.chat).emit('new-message', data)
      })

      socket.on('disconnect', () => {
        socket.leave(communicationType1)
        socket.leave(communicationType2)
        connectedUsers.leaveChat(this.profileId)
        console.log({ userStatus: connectedUsers.getStatus(this.userId) })
      })
    }
  }

  protected static readonly isInChat = (): boolean => {
    const [communicationType1, communicationType2] = this.chat

    if (!this.userStatus || this.userStatus.chat.length == 0) return false

    const inChat =
      this.userStatus.chat.includes(communicationType1) &&
      this.userStatus.chat.includes(communicationType2)

    if (!inChat) {
      this.userSocketId = this.userStatus.socketId
      return false
    }

    return true
  }

  protected static readonly upsertChatMessage = async (message: string) => {
    const inChat = this.isInChat()

    const existedChat = await this.chatRepository.findOne({
      filter: {
        $or: [
          {
            startedBy: this.profileId,
            messaging: this.userId,
          },
          {
            startedBy: this.userId,
            messaging: this.profileId,
          },
        ],
      },
    })

    if (!existedChat)
      return await this.chatRepository.create({
        startedBy: this.profileId,
        messaging: this.userId,
        ...(inChat
          ? {
              messages: [
                {
                  from: this.profileId,
                  to: this.userId,
                  message,
                  sentAt: moment().format('h:mm A'),
                },
              ],
            }
          : {
              unread: [
                {
                  from: this.profileId,
                  to: this.userId,
                  message,
                  sentAt: moment().format('h:mm A'),
                },
              ],
            }),
      })

    if (!inChat)
      existedChat.unread.unshift({
        from: this.profileId,
        to: this.userId,
        message,
        sentAt: moment().format('h:mm A'),
      })

    existedChat.messages.unshift({
      from: this.profileId,
      to: this.userId,
      message,
      sentAt: moment().format('h:mm A'),
    })

    return await existedChat.save()
  }

  public static readonly getAllChats = async (profileId: MongoId) => {
    const chats = await this.chatRepository.find({
      filter: { $or: [{ startedBy: profileId }, { messaging: profileId }] },
      options: { lean: true },
      populate: [
        {
          path: 'startedBy',
          select: {
            _id: 1,
            username: 1,
            fullName: 1,
            'avatar.secure_url': 1,
          },
        },
        {
          path: 'messaging',
          select: {
            _id: 1,
            username: 1,
            fullName: 1,
            'avatar.secure_url': 1,
          },
        },
      ],
    })

    return chats
  }

  public static readonly emptyMissedMessages = async (chat: IChat) => {
    if (chat.unread.length === 0) return

    return await this.chatRepository.findByIdAndUpdate({
      _id: chat._id,
      data: { $set: { unread: [] } },
    })
  }

  public static readonly deleteChat = async ({
    profileId,
    currentChatId,
  }: DTO.IDeleteChat) => {}

  public static readonly deleteMessage = async ({
    currentChatId,
    messageId,
  }: DTO.IDeleteMessage) => {}

  public static readonly likeMessage = async ({
    currentChatId,
    messageId,
  }: DTO.ILikeMessage) => {}
}
