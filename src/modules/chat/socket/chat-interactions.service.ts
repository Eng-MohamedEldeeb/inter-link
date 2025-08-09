import moment from 'moment'
import notificationsService from '../../../common/services/notifications/notifications.service'
import chatRepository from '../../../common/repositories/chat.repository'
import roomMembersController from '../../../common/controllers/room-members.controller'

import { ISocket } from '../../../common/interface/ISocket.interface'
import { ChatService } from '../chat.service'
import { ISendMessage } from '../dto/chat.dto'
import { isInChat, upsertChatMessage } from './helpers/chat-helpers'

export const sendMessage = async (socket: ISocket) => {
  const { _id: profileId } = socket.profile._id
  const { _id: userId } = socket.user._id

  ChatService.setProfileId = profileId
  ChatService.setUserId = userId

  ChatService.setRoomId = `${profileId} ${userId}`

  const existedChat = await chatRepository.findOne({
    filter: {
      $or: [
        { startedBy: profileId, participant: userId },
        { participant: profileId, startedBy: userId },
      ],
    },
    projection: { roomId: 1 },
  })

  if (existedChat) ChatService.setRoomId = existedChat.roomId

  const roomId = ChatService.getCurrentRoomId

  roomMembersController.joinChat({ profileId, roomId })

  socket.join(roomId)

  socket.on('send-message', async ({ message }: { message: string }) => {
    await upsertChatMessage({ roomId, message, profileId, userId })
    const inChat = isInChat({ roomId, userId })

    const data: ISendMessage = {
      message,
      sentAt: moment().format('h:mm A'),
      from: socket.profile,
    }

    if (!inChat) {
      return await notificationsService.sendNotification({
        userId: userId,
        notificationDetails: {
          from: socket.profile,
          notificationMessage: message,
          refTo: 'Chat',
          sentAt: moment().format('h:mm A'),
        },
      })
    }

    return socket.to(roomId).emit('new-message', data)
  })

  socket.on('disconnect', () => {
    roomMembersController.leaveChat({ profileId, roomId })

    socket.leave(roomId)
  })
}
