import chatHelper from "./helpers/chat-helper"
import notifyService from "../../../common/services/notify/notify.service"

import { ISocket } from "../../../common/interface/ISocket.interface"
import { ISendMessage } from "../dto/chat.dto"
import { currentMoment } from "../../../common/decorators/moment/moment"
import { MongoId } from "../../../common/types/db"
import { messageRepository } from "../../../common/repositories"

class ChatInteractions {
  private readonly chatHelper = chatHelper

  private readonly messageRepository = messageRepository

  private chatId!: MongoId
  private profileId!: MongoId
  private userId!: MongoId

  public readonly connect = async (socket: ISocket) => {
    this.chatId = await this.chatHelper.findOrCreate({
      profileId: this.profileId,
      userId: this.userId,
    })

    this.profileId = socket.profile._id
    this.userId = socket.user._id

    this.chatHelper.joinChat({ chatId: this.chatId, profileId: this.profileId })

    socket.join(this.chatId.toString())

    socket.on("send-message", this.sendMessage(socket))

    socket.on("disconnect", this.disconnect(socket))
  }

  private readonly sendMessage = (socket: ISocket) => {
    return async ({ message }: { message: string }) => {
      const inChat = this.chatHelper.isInChat({
        chatId: this.chatId,
        userId: this.userId,
      })

      const createdMessage = await this.messageRepository.create({
        from: this.profileId,
        to: this.userId,
        chatId: this.chatId,
        message,
        sentAt: currentMoment(),
      })

      const data: ISendMessage = {
        from: socket.profile,
        message,
        sentAt: currentMoment(),
      }

      if (!inChat) {
        return notifyService.sendNotification({
          userId: this.userId,
          notificationDetails: {
            from: socket.profile,
            message,
            messageId: createdMessage._id,
            on: { _id: createdMessage._id },
            sentAt: currentMoment(),
            refTo: "Chat",
          },
        })
      }

      return socket.to(this.chatId.toString()).emit("new-message", data)
    }
  }

  private readonly disconnect = (socket: ISocket) => () => {
    this.chatHelper.leaveChat({
      chatId: this.chatId,
      profileId: this.profileId,
    })

    socket.leave(this.chatId.toString())
  }
}
export default new ChatInteractions()
