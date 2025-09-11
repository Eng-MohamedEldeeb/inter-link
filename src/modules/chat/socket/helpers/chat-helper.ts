import chatRepository from "../../../../common/repositories/chat.repository"
import userService from "../../../user/user.service"

import { MongoId } from "../../../../common/types/db"

export const chatStatus = new Map<string, string[]>()

class ChatHelper {
  private readonly chatRepository = chatRepository
  private readonly userService = userService

  public readonly findOrCreate = async ({
    profileId,
    userId,
  }: {
    profileId: MongoId
    userId: MongoId
  }) => {
    const existedChat = await this.chatRepository.findOne({
      filter: {
        $or: [
          { startedBy: profileId, participants: userId },
          { participants: profileId, startedBy: userId },
        ],
      },
      populate: [{ path: "messages" }, { path: "newMessages" }],
      projection: { _id: 1 },
    })

    if (!existedChat) {
      const createdChat = await this.chatRepository.create({
        startedBy: profileId,
        participants: [userId],
      })

      return createdChat._id
    }

    return existedChat._id
  }

  public readonly isInChat = ({
    chatId,
    userId,
  }: {
    chatId: MongoId
    userId: MongoId
  }) => {
    const chatMembers = chatStatus.get(chatId.toString()) ?? []
    const memberIndex = chatMembers.indexOf(userId.toString())

    if (chatMembers.length === 0 || memberIndex === -1) return false

    return true
  }

  public readonly joinChat = ({
    chatId,
    profileId,
  }: {
    chatId: MongoId
    profileId: MongoId
  }) => {
    const chatMembers = chatStatus.get(chatId.toString())

    if (!chatMembers)
      return chatStatus.set(chatId.toString(), [profileId.toString()])

    chatMembers.push(profileId.toString())

    return chatStatus.set(chatId.toString(), chatMembers)
  }

  public readonly leaveChat = ({
    chatId,
    profileId,
  }: {
    chatId: MongoId
    profileId: MongoId
  }) => {
    const chatMembers = chatStatus.get(chatId.toString())

    if (!chatMembers) return

    const memberIndex = chatMembers.indexOf(profileId.toString())

    chatMembers.splice(memberIndex, 1)

    return chatStatus.set(chatId.toString(), chatMembers)
  }

  public readonly isOnline = (userId: MongoId): boolean => {
    const userStatus = this.userService.getCurrentStatus(userId)

    if (!userStatus) return false

    const { isConnected } = userStatus

    return isConnected
  }
}

export default new ChatHelper()
