import chatService from "../chat.service"
import notifyService from "../../../common/services/notify/notify.service"
import chatRepository from "../../../common/repositories/concrete/chat.repository"
import roomMembersController from "../../../common/controllers/room-members.controller"

import { ISocket } from "../../../common/interface/ISocket.interface"
import { ISendMessage } from "../dto/chat.dto"
import { ChatHelpers } from "./helpers/chat-helpers"
import { currentMoment } from "../../../common/decorators/moment/moment"
import { ChatType } from "../../../db/interfaces/IChat.interface"
import { MongoId } from "../../../common/types/db"

class ChatInteractions {
  private readonly chatRepository = chatRepository
  private readonly chatService = chatService

  private chatRoomId!: MongoId
  private profileId!: MongoId
  private userId!: MongoId

  public readonly connect = async (socket: ISocket) => {
    await this.readAllMessages(socket)

    roomMembersController.joinChat({
      profileId: this.profileId,
      chatRoomId: this.chatRoomId,
    })

    socket.join(this.chatRoomId.toString())

    socket.on("send-message", this.sendMessage(socket))

    socket.on("disconnect", this.disconnect(socket))
  }

  private readonly readAllMessages = async (socket: ISocket) => {
    const { _id: profileId } = socket.profile._id
    const { _id: userId } = socket.user._id

    this.chatService.setProfileId = profileId
    this.chatService.setUserId = userId

    const existedChat = await this.chatRepository.findOne({
      filter: {
        $or: [
          { startedBy: profileId, participants: userId },
          { participants: profileId, startedBy: userId },
        ],
      },
      projection: { _id: 1, newMessages: 1, messages: 1 },
    })

    if (existedChat) {
      for (const msg of existedChat.newMessages)
        existedChat.messages.unshift(msg)

      existedChat.newMessages = []

      await existedChat.save()
    }

    if (!existedChat) {
      const newChat = await this.chatRepository.create({
        type: ChatType.OTO,
        startedBy: profileId,
        participants: [userId],
      })

      this.chatService.setCurrentChatRoomId = newChat._id
    }

    this.chatRoomId = this.chatService.getCurrentChatRoomId
  }

  private readonly sendMessage = (socket: ISocket) => {
    return async ({ message }: { message: string }) => {
      const updatedChat = await ChatHelpers.upsertChatMessage({
        chatRoomId: this.chatRoomId.toString(),
        message,
        profileId: this.profileId,
        userId: this.userId,
      })
      const inChat = ChatHelpers.isInChat({
        chatRoomId: this.chatRoomId.toString(),
        userId: this.userId,
      })

      const data: ISendMessage = {
        message,
        sentAt: currentMoment(),
        from: socket.profile,
      }

      if (!inChat) {
        return notifyService.sendNotification({
          userId: this.userId,
          notificationDetails: {
            from: socket.profile,
            message,
            messageId: updatedChat._id,
            refTo: "Chat",
            on: { _id: updatedChat._id! },
            sentAt: currentMoment(),
          },
        })
      }

      return socket.to(this.chatRoomId.toString()).emit("new-message", data)
    }
  }

  private readonly disconnect = (socket: ISocket) => () => {
    roomMembersController.leaveChat({
      profileId: this.profileId,
      chatRoomId: this.chatRoomId,
    })

    socket.leave(this.chatRoomId.toString())
  }
}
export default new ChatInteractions()
