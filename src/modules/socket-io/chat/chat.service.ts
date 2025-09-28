import chatHelper from "./helpers/chat-helper"

import { ISocket } from "../../../common/interface/ISocket.interface"
import { currentMoment } from "../../../common/decorators/moment/moment"
import { MongoId } from "../../../common/types/db"

import { INotificationInputs } from "../../../db/interfaces/INotification.interface"

import { NotificationType } from "../../../common/services/notify/types"
import { ConnectedUser } from "../user-status/user-status"
import { IMessageInputs } from "../../../db/interfaces/IMessage.interface"

export const onSendMessage = ({
  socket,
  chatId,
  userId,
}: {
  socket: ISocket
  chatId: MongoId
  userId: MongoId
}) => {
  return async ({ message }: { message: string }) => {
    const { isConnected } = ConnectedUser.getCurrentStatus(userId)

    const inChat = chatHelper.isInChat({
      chatId: chatId,
      userId: userId,
    })

    console.log({ inChat })

    // const data: Pick<IMessageInputs, "message" | "sentAt"> = {
    //   message,
    //   sentAt: currentMoment(),
    // }

    await chatHelper.sendMessageStrategy({
      isConnected,
      inChat,
      sender: socket.profile,
      receiver: userId,
      chatId,
      message,
    })

    // return socket.to(chatId.toString()).emit(NotificationType.newMessage, data)
  }
}

export const onEditMessage = ({
  socket,
  chatId,
  userId,
}: {
  socket: ISocket
  chatId: MongoId
  userId: MongoId
}) => {
  return async ({ message }: { message: string }) => {
    const { isConnected } = ConnectedUser.getCurrentStatus(userId)

    const inChat = chatHelper.isInChat({
      chatId: chatId,
      userId: userId,
    })

    console.log({ inChat })

    const data: Pick<IMessageInputs, "message" | "sentAt"> = {
      message,
      sentAt: currentMoment(),
    }

    await chatHelper.sendMessageStrategy({
      isConnected,
      inChat,
      sender: socket.profile,
      receiver: userId,
      chatId,
      message,
    })

    // return socket.to(chatId.toString()).emit(NotificationType.newMessage, data)
  }
}
export const onDisconnect =
  ({
    socket,
    chatId,
    userId,
  }: {
    socket: ISocket
    chatId: MongoId
    userId: MongoId
  }) =>
  () => {
    chatHelper.leaveChat({
      chatId: chatId,
      profileId: socket.profile._id,
    })

    console.log("left")

    socket.leave(chatId.toString())
  }
