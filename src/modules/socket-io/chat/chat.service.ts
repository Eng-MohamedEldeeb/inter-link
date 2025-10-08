import chatHelper from "./helpers/chat-helper"

import { ISocket } from "../../../common/interface/ISocket.interface"
import { currentMoment } from "../../../common/decorators/moment/moment"
import { MongoId } from "../../../common/types/db"
import { messageRepository } from "../../../db/repositories"
import { Notify } from "../../../common/services/notify/notify.event"
import { NotificationType } from "../../../common/services/notify/types"
import { ConnectedUser } from "../user-status/user-status"
import { InteractionType } from "../../../db/interfaces/INotification.interface"

import {
  IMessageInputs,
  MessageStatus,
} from "../../../db/interfaces/IMessage.interface"

export const onTyping = ({
  socket,
  chatId,
}: {
  socket: ISocket
  chatId: MongoId
}) => {
  return async () => {
    return socket.to(chatId.toString()).emit(NotificationType.typing, {
      message: `${socket.user.username} is typing`,
    })
  }
}

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
    console.log({ message })

    const { isConnected } = ConnectedUser.getCurrentStatus(userId)

    const inChat = chatHelper.isInChat({
      chatId: chatId,
      userId: userId,
    })

    console.log({ inChat })

    if (!inChat && !isConnected) {
      return await messageRepository.create({
        message,
        sender: socket.profile._id,
        receiver: userId,
        chatId,
        status: MessageStatus.sent,
        sentAt: currentMoment(),
      })
    }

    if (!inChat && isConnected) {
      await messageRepository.create({
        message,
        sender: socket.profile._id,
        receiver: userId,
        chatId,
        receivedAt: new Date(Date.now()),
        status: MessageStatus.received,
        sentAt: currentMoment(),
      })

      return Notify.sendNotification({
        sender: socket.profile,
        receiver: userId,
        body: {
          interactionType: InteractionType.newMessage,
          message,
          sentAt: currentMoment(),
        },
      })
    }

    await messageRepository.create({
      message,
      sender: socket.profile._id,
      receiver: userId,
      chatId,
      receivedAt: new Date(Date.now()),
      status: MessageStatus.seen,
      sentAt: currentMoment(),
    })

    const data: Pick<IMessageInputs, "message" | "sentAt"> = {
      message,
      sentAt: currentMoment(),
    }

    return socket.to(chatId.toString()).emit(NotificationType.newMessage, data)
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

    // return socket.to(chatId.toString()).emit(NotificationType.newMessage, data)
  }
}
export const onDisconnect =
  ({ socket, chatId }: { socket: ISocket; chatId: MongoId }) =>
  () => {
    chatHelper.leaveChat({
      chatId: chatId,
      profileId: socket.profile._id,
    })

    console.log("left")

    socket.leave(chatId.toString())
  }
