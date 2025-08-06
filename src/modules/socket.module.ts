import { Server } from 'socket.io'

import { asyncHandler } from '../common/decorators/async-handler/async-handler.decorator'
import { ISocket } from '../common/interface/ISocket.interface'
import { applyGuards } from '../common/decorators/guard/apply-guards.decorator'
import { ChatService } from './chat/chat.service'

import isAuthenticatedGuard from '../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../common/guards/auth/is-authorized.guard'

import connectedUsers from '../common/services/notifications/online-users.controller'
import userExistenceGuard from '../common/guards/user/user-existence.guard'
import notificationsService from '../common/services/notifications/notifications.service'

export const socketIoBootStrap = async (io: Server) => {
  io.use(applyGuards(isAuthenticatedGuard, isAuthorizedGuard)).on(
    'connection',
    asyncHandler(async (socket: ISocket) => {
      const profileId = socket.profile._id

      connectedUsers.setOnline({
        profileId,
        socketId: socket.id,
      })

      await notificationsService.readMissedNotifications({
        userId: profileId,
        socketId: socket.id,
      })

      socket.on('disconnect', async () => {
        connectedUsers.setOffline(profileId)
      })
    }),
  )

  io.of('/chat')
    .use(
      applyGuards(isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard),
    )
    .on('connection', asyncHandler(await ChatService.sendMessage(io)))
}
