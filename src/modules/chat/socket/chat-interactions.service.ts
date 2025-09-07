import chatService from "../chat.service"
import notifyService from "../../../common/services/notify/notify.service"
import chatRepository from "../../../common/repositories/chat.repository"
import roomMembersController from "../../../common/controllers/room-members.controller"

import { ISocket } from "../../../common/interface/ISocket.interface"
import { ISendMessage } from "../dto/chat.dto"
import { ChatHelpers } from "./helpers/chat-helpers"
import { getNowMoment } from "../../../common/decorators/moment/moment"
import { ChatType } from "../../../db/interfaces/IChat.interface"

export class ChatInteractions {
  public static readonly sendMessage = async (socket: ISocket) => {
    const { _id: profileId } = socket.profile._id
    const { _id: userId } = socket.user._id

    chatService.setProfileId = profileId
    chatService.setUserId = userId

    const existedChat = await chatRepository.findOne({
      filter: {
        $or: [
          { startedBy: profileId, participants: userId },
          { participants: profileId, startedBy: userId },
        ],
      },
      projection: { _id: 1, newMessages: 1, messages: 1 },
    })

    if (existedChat) {
      for (const msg of existedChat.newMessages) {
        existedChat.messages.unshift(msg)
      }

      existedChat.newMessages = []

      await existedChat.save()
    }

    if (!existedChat) {
      const newChat = await chatRepository.create({
        type: ChatType.OTO,
        startedBy: profileId,
        participants: [userId],
      })

      chatService.setRoomId = newChat._id
    }

    const roomId = chatService.getCurrentRoomId

    roomMembersController.joinChat({ profileId, roomId })

    socket.join(roomId.toString())

    socket.on("send-message", async ({ message }: { message: string }) => {
      const updatedChat = await ChatHelpers.upsertChatMessage({
        roomId: roomId.toString(),
        message,
        profileId,
        userId,
      })
      const inChat = ChatHelpers.isInChat({ roomId: roomId.toString(), userId })

      const data: ISendMessage = {
        message,
        sentAt: getNowMoment(),
        from: socket.profile,
      }

      if (!inChat) {
        return notifyService.sendNotification({
          userId: userId,
          notificationDetails: {
            from: socket.profile,
            message,
            messageId: updatedChat._id,
            refTo: "Chat",
            on: { _id: updatedChat._id! },
            sentAt: getNowMoment(),
          },
        })
      }

      return socket.to(roomId.toString()).emit("new-message", data)
    })

    socket.on("disconnect", () => {
      roomMembersController.leaveChat({ profileId, roomId })

      socket.leave(roomId.toString())
    })
  }
}
