import { asyncHandler } from "../../../common/decorators"
import { ISocket } from "../../../common/interface/ISocket.interface"
import { onDisconnect, onSendMessage } from "./chat.service"

import chatHelper from "./helpers/chat-helper"

export const chatConnection = asyncHandler(async (socket: ISocket) => {
  const profile = socket.profile
  const userId = socket.user._id

  const chatId = await chatHelper.findOrCreate({
    profileId: profile._id,
    userId: userId,
  })

  chatHelper.joinChat({
    chatId: chatId,
    profileId: profile._id,
  })

  socket.join(chatId.toString())

  socket.on("send-message", onSendMessage({ socket, userId, chatId }))

  socket.on("disconnect", onDisconnect({ socket, userId, chatId }))
})
