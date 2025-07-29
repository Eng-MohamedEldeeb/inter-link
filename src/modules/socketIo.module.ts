import { Server } from 'socket.io'

import { asyncHandler } from '../common/decorators/async-handler/async-handler.decorator'
import { ISocket } from '../common/interface/ISocket.interface'
import { applyGuards } from '../common/decorators/guard/apply-guards.decorator'

import moment from 'moment'

import isAuthenticatedGuard from '../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../common/guards/auth/is-authorized.guard'

import notificationsService from '../common/services/notifications/notifications.service'
import ConnectedUsers from '../common/services/notifications/online-users.controller'

export const socketIoBootStrap = (io: Server) => {
  io.use(applyGuards(isAuthenticatedGuard, isAuthorizedGuard)).on(
    'connection',
    asyncHandler(async (socket: ISocket) => {
      const userId = socket.profile._id

      ConnectedUsers.setOnline({
        userId: userId.toString(),
        socketId: socket.id,
      })

      await notificationsService.readMissedNotifications({
        userId,
        socketId: socket.id,
      })

      socket.on('send-message', (data: { msg: string; to: string }) => {
        console.log({ data })
        const { msg, to } = data
        const { socketId, isOnline } = ConnectedUsers.getStatus(to)

        console.log({ socketId, isOnline })

        socket.to(socketId).emit('new-message', {
          msg,
          at: moment().format('h:mm A'),
          from: socket.profile,
        })
      })

      socket.on('disconnect', () =>
        ConnectedUsers.setOffline(userId.toString()),
      )
    }),
  )
}
