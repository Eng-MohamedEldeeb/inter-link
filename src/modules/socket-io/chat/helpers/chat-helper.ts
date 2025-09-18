import { ConnectedUser } from "../../user-status/user-status"
import { MongoId } from "../../../../common/types/db"

import { messageRepository, chatRepository } from "../../../../db/repositories"
import { currentMoment } from "../../../../common/decorators/moment/moment"
import { Notify } from "../../../../common/services/notify/notify.event"
import { NotificationRefTo } from "../../../../db/interfaces/INotification.interface"
import { SenderDetails } from "../../../../common/services/notify/types"
import { MessageStatus } from "../../../../db/interfaces/IMessage.interface"

export const chatStatus = new Map<string, string[]>()

class ChatHelper {
  private readonly ConnectedUser = ConnectedUser
  private readonly Notify = Notify
  private readonly chatRepository = chatRepository
  private readonly messageRepository = messageRepository

  public readonly chatStrategy = async ({
    inChat,
    isConnected,
    message,
    sender,
    receiver,
    chatId,
  }: {
    inChat: boolean
    isConnected: boolean
    message: string
    sender: SenderDetails
    receiver: MongoId
    chatId: MongoId
  }) => {
    if (!inChat && !isConnected) {
      const createdMessage = await this.messageRepository.create({
        message,
        sender: sender._id,
        receiver,
        chatId,
        receivedAt: new Date(Date.now()),
        sentAt: currentMoment(),
      })

      return Notify.sendNotification({
        sender,
        receiverId: receiver,
        body: {
          message,
          sentAt: currentMoment(),
          relatedTo: createdMessage._id,
          ref: NotificationRefTo.Chat,
        },
      })
    }

    if (!inChat && isConnected) {
      const createdMessage = await messageRepository.create({
        message,
        sender: sender._id,
        receiver,
        chatId,
        receivedAt: new Date(Date.now()),
        status: MessageStatus.received,
        sentAt: currentMoment(),
      })

      return Notify.sendNotification({
        sender,
        receiverId: receiver,
        body: {
          message,
          sentAt: currentMoment(),
          relatedTo: createdMessage._id,
          ref: NotificationRefTo.Chat,
        },
      })
    }

    return await messageRepository.create({
      message,
      sender: sender._id,
      receiver,
      chatId,
      sentAt: currentMoment(),
      receivedAt: new Date(Date.now()),
      seenAt: new Date(Date.now()),
      seenBy: [receiver],
      status: MessageStatus.seen,
    })
  }

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
      projection: { _id: 1 },
    })

    if (!existedChat) {
      console.log({ newChat: existedChat, profileId, userId })

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

    console.log({ isInChat: chatMembers })

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

    console.log({ chatMembers })

    if (!chatMembers) return

    const memberIndex = chatMembers.indexOf(profileId.toString())

    chatMembers.splice(memberIndex, 1)

    console.log({ chatMembers })

    return chatStatus.set(chatId.toString(), chatMembers)
  }

  public readonly isOnline = (userId: MongoId): boolean => {
    const userStatus = this.ConnectedUser.getCurrentStatus(userId)

    if (!userStatus) return false

    const { isConnected } = userStatus

    return isConnected
  }
}

export default new ChatHelper()
