import { Server } from 'socket.io'

import { ISocket } from '../common/interface/ISocket.interface'
import { asyncHandler } from '../common/decorators/async-handler/async-handler.decorator'
import { applyGuards } from '../common/decorators/guard/apply-guards.decorator'

import isAuthenticatedGuard from '../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../common/guards/auth/is-authorized.guard'

import notificationsService from '../common/services/notifications/notifications.service'
import onlineUsersController from '../common/services/notifications/online-users.controller'

export const wsBootStrap = (io: Server) => {
  io.use(applyGuards([isAuthenticatedGuard, isAuthorizedGuard])).on(
    'connection',
    asyncHandler(async (socket: ISocket) => {
      const userId = socket.profile._id

      onlineUsersController.register({
        userId: userId.toString(),
        socketId: socket.id,
      })

      await notificationsService.readReceivedNotifications({
        userId,
        socketId: socket.id,
      })

      socket.on('disconnect', () =>
        onlineUsersController.remove(userId.toString()),
      )
    }),
  )
}
