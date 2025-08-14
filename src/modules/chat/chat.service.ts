import { MongoId } from '../../common/types/db'
import { IMessageDetails } from '../../db/interfaces/IChat.interface'
import { TChat } from '../../db/documents'
import { throwError } from '../../common/handlers/error-message.handler'

import {
  INotifications,
  UserDetails,
} from '../../db/interfaces/INotification.interface'

import * as DTO from './dto/chat.dto'

import chatRepository from '../../common/repositories/chat.repository'
import notificationsService from '../../common/services/notifications/notifications.service'
import notificationRepository from '../../common/repositories/notification.repository'
import { getNowMoment } from '../../common/decorators/moment/moment'

export class ChatService {
  protected static readonly chatRepository = chatRepository
  protected static readonly notificationRepository = notificationRepository
  protected static readonly notificationService = notificationsService

  protected static roomId: string
  protected static userId: MongoId
  protected static profileId: MongoId

  protected static userSocketId: string

  public static set setUserId(userId: MongoId) {
    this.userId = userId
  }
  public static set setProfileId(profileId: MongoId) {
    this.profileId = profileId
  }

  public static set setRoomId(roomId: string) {
    this.roomId = roomId
  }

  public static get getCurrentRoomId(): string {
    return this.roomId
  }

  public static readonly getAllChats = async (profileId: MongoId) => {
    const chats = await this.chatRepository.find({
      filter: { $or: [{ startedBy: profileId }, { participant: profileId }] },
      projection: {
        messages: {
          $slice: 1,
        },
        newMessages: {
          $slice: 1,
        },
      },
      options: { lean: true },
      populate: [
        {
          path: 'startedBy',
          select: {
            _id: 1,
            username: 1,

            'avatar.secure_url': 1,
          },
        },
        {
          path: 'participant',
          select: {
            _id: 1,
            username: 1,

            'avatar.secure_url': 1,
          },
        },
      ],
    })

    return chats
  }

  public static readonly getSingle = async (chat: TChat) => {
    if (chat.newMessages.length >= 1) await this.emptyMissedMessages(chat)

    return chat
  }

  protected static readonly emptyMissedMessages = async (chat: TChat) => {
    for (let i = chat.newMessages.length - 1; i >= 0; i--) {
      chat.messages.unshift(chat.newMessages[i])
    }

    chat.newMessages = []

    return await chat.save()
  }

  public static readonly likeMessage = async ({
    profile,
    messageId,
    chat,
  }: {
    profile: UserDetails
    messageId: MongoId
    chat: TChat
  }) => {
    const { inMessages, inUnread } = this.findMessage({ chat, messageId })

    const message = (inMessages ? inMessages : inUnread)!

    const isLiked = this.checkLikes({ message, profile })

    if (isLiked)
      return await this.chatRepository.findOneAndUpdate({
        filter: {
          $and: [{ _id: chat._id }, { 'messages._id': messageId }],
        },
        data: {
          $pull: {
            'messages.$.likedBy': profile._id,
          },
        },
      })

    await this.chatRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: chat._id }, { 'messages._id': messageId }],
      },
      data: {
        $addToSet: {
          'messages.$.likedBy': profile._id,
        },
      },
    })

    await this.notificationService.sendNotification({
      userId: message.from._id,
      notificationDetails: {
        from: profile,
        message: `${profile.username} Liked Your Message 🧡`,
        messageId,
        refTo: 'Chat',
        sentAt: getNowMoment(),
      },
    })
  }

  protected static readonly findMessage = ({
    chat,
    messageId,
  }: {
    chat: TChat
    messageId: MongoId
  }): {
    inMessages: IMessageDetails | undefined
    inUnread: IMessageDetails | undefined
  } => {
    const inMessages = chat.messages.find(message =>
      message._id?.equals(messageId),
    )

    const inUnread = chat.newMessages.find(message =>
      message._id?.equals(messageId),
    )

    if (!inMessages && !inUnread)
      return throwError({ msg: 'message not found', status: 404 })

    return { inMessages, inUnread }
  }

  protected static readonly checkLikes = ({
    message,
    profile,
  }: {
    message: IMessageDetails
    profile: UserDetails
  }) => {
    const likedBy = message.likedBy

    if (!likedBy || likedBy.length == 0) return false

    return likedBy.some(user => user._id.equals(profile._id))
  }

  public static readonly editMessage = async ({
    profileId,
    messageId,
    chatId,
    newMessage,
  }: {
    profileId: MongoId
    messageId: MongoId
    chatId: MongoId
    newMessage: string
  }) => {
    const chat = await this.findUserMessageInChat({
      chatId,
      messageId,
      profileId,
    })

    let searchedMessage: string = ''

    const { inMessages, inUnread } = this.findMessage({
      chat,
      messageId,
    })

    if (inUnread) {
      searchedMessage = inUnread.message
      inUnread.message = newMessage
      inUnread.updatedAt = new Date(Date.now())
    }

    if (inMessages) {
      searchedMessage = inMessages.message
      inMessages.message = newMessage
      inMessages.updatedAt = new Date(Date.now())
    }

    const userId = chat.startedBy.equals(profileId)
      ? chat.participant
      : chat.startedBy

    const relatedNotification = await this.findRelatedNotification({
      belongsTo: userId,
      messageFrom: profileId,
      searchedMessage,
    })

    if (!relatedNotification) return await chat.save()

    const relatedMissedMessages = this.hasRelatedNotification({
      relatedNotification,
      messageId,
    })

    if (!relatedMissedMessages) return chat

    relatedMissedMessages.message = newMessage
    relatedMissedMessages.updatedAt = new Date(Date.now())

    return await Promise.all([chat.save(), relatedNotification.save()])
  }

  protected static readonly findUserMessageInChat = async ({
    chatId,
    messageId,
    profileId,
  }: {
    chatId: MongoId
    messageId: MongoId
    profileId: MongoId
  }) => {
    const chat = await this.chatRepository.findOne({
      filter: {
        $and: [
          {
            $and: [
              { _id: chatId },
              {
                $or: [
                  { 'messages._id': messageId },
                  { 'newMessages._id': messageId },
                ],
              },
            ],
          },
          {
            $or: [
              {
                $and: [
                  { 'messages.from': profileId },
                  { 'messages.deletedAt': { $exists: false } },
                ],
              },
              {
                $and: [
                  { 'newMessages.from': profileId },
                  { 'newMessages.deletedAt': { $exists: false } },
                ],
              },
            ],
          },
        ],
      },
    })
    return chat!
  }

  protected static readonly findRelatedNotification = async ({
    belongsTo,
    messageFrom,
    searchedMessage,
  }: {
    belongsTo: MongoId
    messageFrom: MongoId
    searchedMessage: string
  }) => {
    return await this.notificationRepository.findOne({
      filter: {
        $and: [
          {
            $and: [{ belongsTo }, { 'missedMessages.from': messageFrom }],
          },
          {
            $and: [
              {
                'missedMessages.messages.message': {
                  $regex: searchedMessage,
                },
              },
              { 'missedMessages.messages.deletedAt': { $exists: false } },
            ],
          },
        ],
      },
    })
  }

  protected static readonly hasRelatedNotification = ({
    relatedNotification,
    messageId,
  }: {
    relatedNotification: INotifications
    messageId: MongoId
  }) => {
    return relatedNotification.missedMessages.find(message =>
      message._id?.equals(messageId),
    )
  }

  public static readonly deleteMessage = async ({
    profileId,
    messageId,
    chatId,
  }: {
    profileId: MongoId
    messageId: MongoId
    chatId: MongoId
  }) => {
    const deletedMessage = await this.chatRepository.findOneAndUpdate({
      filter: {
        $and: [
          {
            $and: [{ _id: chatId }, { 'messages._id': messageId }],
          },
          {
            $and: [
              { 'messages.from': profileId },
              { 'messages.deletedAt': { $exists: false } },
            ],
          },
        ],
      },
      data: {
        'messages.$.message': 'message is deleted',
        'messages.$.deletedAt': Date.now(),
      },
    })

    return (
      deletedMessage ??
      throwError({
        msg: 'Message was not deleted as it was not found',
        status: 404,
      })
    )
  }

  public static readonly deleteChat = async ({
    profileId,
    chat,
  }: Omit<DTO.IDeleteChat, 'chatId'>) => {
    const startedChat = chat.startedBy.equals(profileId)
    if (startedChat) await chat.updateOne({ $unset: { startedBy: 1 } })

    const participant = chat.startedBy.equals(profileId)
    if (participant) await chat.updateOne({ $unset: { participant: 1 } })

    await chat.save()
  }
}
