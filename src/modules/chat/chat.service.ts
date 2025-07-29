import { throwError } from '../../common/handlers/error-message.handler'
import { MongoId } from '../../common/types/db'

import * as DTO from './dto/chat.dto'

import chatRepository from '../../common/repositories/chat.repository'

export class ChatService {
  protected static readonly chatRepository = chatRepository

  public static readonly getAllChats = async (profileId: MongoId) => {
    const chats = await this.chatRepository.find({
      filter: { $or: [{ startedBy: profileId }, { chattingWith: profileId }] },
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
          path: 'chattingWith',
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

  public static readonly startChat = async ({
    message,
    profileId,
    userId,
  }: Omit<DTO.IStartChat, 'sentAt'>) => {}

  public static readonly deleteChat = async ({
    profileId,
    chatId,
  }: DTO.IDeleteChat) => {}

  public static readonly deleteMessage = async ({
    chatId,
    messageId,
  }: DTO.IDeleteMessage) => {}

  public static readonly likeMessage = async ({
    chatId,
    messageId,
  }: DTO.ILikeMessage) => {}
}
