import { Server } from 'socket.io'
import { ISocket } from '../../../common/interface/ISocket.interface'

import moment from 'moment'
import connectedUsers from './../../../common/services/notifications/online-users.controller'

import { EventType } from '../../../common/types/ws/events.enum'

export class ChatController {
  public static readonly chatRoom = async (io: Server) => {
    return async (socket: ISocket) => {
      const profileId = socket.profile._id
      const userId = socket.user._id

      const room1 = `${profileId}:${userId}`
      const room2 = `${userId}:${profileId}`

      const chat: [string, string] = [room1, room2]

      socket.join(chat)

      connectedUsers.joinChat({ profileId, chat })

      socket.on('send-message', async ({ msg }: { msg: string }) => {
        const toUser = connectedUsers.getStatus(userId)

        console.log({ toUser })

        const userInChat =
          toUser && toUser.chat.includes(room1) && toUser.chat.includes(room2)

        const data = {
          msg,
          at: moment().format('h:mm A'),
          from: socket.profile,
        }

        console.log({ userInChat })

        if (!toUser || !userInChat)
          return io.to(toUser.socketId).emit(EventType.notification, data)

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
