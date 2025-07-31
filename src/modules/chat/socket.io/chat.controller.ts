import { Server } from 'socket.io'
import { ISocket } from '../../../common/interface/ISocket.interface'

import moment from 'moment'
import connectedUsers from './../../../common/services/notifications/online-users.controller'
import { EventType } from '../../../common/types/ws/events.enum'

export class ChatController {
  public static readonly chatRoom = async ({
    io,
    mainSocketId,
  }: {
    io: Server
    mainSocketId: string
  }) => {
    return async (socket: ISocket) => {
      const profileId = socket.profile._id
      const userId = socket.user._id

      const room1 = `${profileId}:${userId}`
      const room2 = `${userId}:${profileId}`

      const chat: [string, string] = [room1, room2]

      socket.join(chat)

      connectedUsers.joinChat({ profileId, chat })

      const user = connectedUsers.getStatus(userId)

      socket.on('send-message', async ({ msg }: { msg: string }) => {
        const userInChat =
          user.chat && user.chat.includes(room1) && user.chat.includes(room2)

        const data = {
          msg,
          at: moment().format('h:mm A'),
          from: socket.profile,
        }

        console.log({ user })
        console.log({ userInChat })

        if (!user || !userInChat)
          return io.to(user.socketId).emit(EventType.notification, data)

        return socket.to(chat).emit('new-message', data)
      })

      socket.on('disconnect', () => {
        socket.leave(room1)
        socket.leave(room2)
        connectedUsers.leaveChat(profileId)
      })
    }
  }
}
