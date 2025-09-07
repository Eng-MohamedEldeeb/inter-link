import chatService from "../chat.service"
import notifyService from "../../../common/services/notify/notify.service"
import chatRepository from "../../../common/repositories/chat.repository"
import roomMembersController from "../../../common/controllers/room-members.controller"

import { ISocket } from "../../../common/interface/ISocket.interface"
import { ISendMessage } from "../dto/chat.dto"
import { ChatHelpers } from "./helpers/chat-helpers"
import { getNowMoment } from "../../../common/decorators/moment/moment"

export const sendMessage = async (socket: ISocket) => {
  const { _id: profileId } = socket.profile._id
  const { _id: userId } = socket.user._id

  chatService.setProfileId = profileId
  chatService.setUserId = userId

  chatService.setRoomId = `${profileId} ${userId}`

  const existedChat = await chatRepository.findOne({
    filter: {
      $or: [
        { startedBy: profileId, participant: userId },
        { participant: profileId, startedBy: userId },
      ],
    },
    projection: { roomId: 1 },
  })

  if (existedChat) chatService.setRoomId = existedChat.roomId

  const roomId = chatService.getCurrentRoomId

  roomMembersController.joinChat({ profileId, roomId })

  socket.join(roomId)

  socket.on("send-message", async ({ message }: { message: string }) => {
    const updatedChat = await ChatHelpers.upsertChatMessage({
      roomId,
      message,
      profileId,
      userId,
    })
    const inChat = ChatHelpers.isInChat({ roomId, userId })

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
          messageId: updatedChat.messages[0]._id,
          refTo: "Chat",
          on: { _id: updatedChat._id },
          sentAt: getNowMoment(),
        },
      })
    }

    return socket.to(roomId).emit("new-message", data)
  })

  socket.on("disconnect", () => {
    roomMembersController.leaveChat({ profileId, roomId })

    socket.leave(roomId)
  })
}
