import { NotificationService } from './../notification/notification.service'
import { MongoId } from '../../common/types/db'

import * as DTO from './dto/chat.dto'

import chatRepository from '../../common/repositories/chat.repository'
import moment from 'moment'

export class ChatService {
  protected static readonly chatRepository = chatRepository
  protected static readonly NotificationService = NotificationService

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

  public static readonly sendMessage = async ({
    message,
    profileId,
    userId,
  }: Omit<DTO.ISendMessage, 'sentAt'>) => {
    const existedChat = await this.chatRepository.findOne({
      filter: {
        $or: [
          {
            startedBy: profileId,
            messaging: userId,
          },
          {
            startedBy: userId,
            messaging: profileId,
          },
        ],
      },
    })

    if (existedChat) {
      console.log({ existedChat })

      const updatedChat = await this.chatRepository.findByIdAndUpdate({
        _id: existedChat._id,
        data: {
          $push: {
            messages: {
              from: profileId,
              to: userId,
              message,
              sentAt: moment().format('h:mm A'),
            },
          },
        },
      })

      return updatedChat
    }

    const createNewChat = await this.chatRepository.create({
      startedBy: profileId,
      messaging: userId,
      messages: [
        {
          from: profileId,
          to: userId,
          message,
          sentAt: moment().format('h:mm A'),
        },
      ],
    })

    return createNewChat
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
