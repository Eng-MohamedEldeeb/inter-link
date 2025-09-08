import roomMembersController from "../../../../common/controllers/room-members.controller"
import chatRepository from "../../../../common/repositories/concrete/chat.repository"
import userService from "../../../user/user.service"

import { MongoId } from "../../../../common/types/db"
import { currentMoment } from "../../../../common/decorators/moment/moment"

export class ChatHelpers {
  private static readonly chatRepository = chatRepository
  private static readonly userService = userService
  private static readonly roomMembersController = roomMembersController

  public static readonly isInChat = ({
    chatRoomId,
    userId,
  }: {
    chatRoomId: string
    userId: MongoId
  }): boolean => {
    const roomMembers = this.roomMembersController.getRoomMembers(chatRoomId)

    if (roomMembers.length == 0) return false

    const inChat = roomMembers.includes(userId.toString())

    if (!inChat) return false

    return true
  }

  public static readonly isConnected = (userId: MongoId): boolean => {
    const userStatus = this.userService.getCurrentStatus(userId)

    if (!userStatus) return false

    const { isConnected } = userStatus

    return isConnected
  }

  public static readonly upsertChatMessage = async ({
    chatRoomId,
    message,
    profileId,
    userId,
  }: {
    chatRoomId: string
    profileId: MongoId
    userId: MongoId
    message: string
  }) => {
    const inChat = this.isInChat({ chatRoomId: chatRoomId, userId: userId })

    const existedChat = await this.chatRepository.findOne({
      filter: {
        $or: [
          { startedBy: profileId, participants: userId },
          { participants: profileId, startedBy: userId },
        ],
      },
    })
    if (!existedChat) {
      const createdChat = await this.chatRepository.create({
        startedBy: profileId,
        participants: [userId],
        ...(inChat
          ? {
              messages: [
                {
                  from: profileId,
                  to: userId,
                  message,
                  sentAt: currentMoment(),
                },
              ],
            }
          : {
              newMessages: [
                {
                  from: profileId,
                  to: userId,
                  message,
                  sentAt: currentMoment(),
                },
              ],
            }),
      })
      return inChat ? createdChat.messages[0] : createdChat.newMessages[0]
    }

    if (!inChat) {
      existedChat.newMessages.unshift({
        from: profileId,
        to: userId,
        message,
        sentAt: currentMoment(),
      })
      await existedChat.save()
      return existedChat.newMessages[0]
    }

    existedChat.messages.unshift({
      from: profileId,
      to: userId,
      message,
      sentAt: currentMoment(),
    })
    await existedChat.save()
    return existedChat.messages[0]
  }
}
