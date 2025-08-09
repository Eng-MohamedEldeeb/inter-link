import { Server } from 'socket.io'

import { asyncHandler } from '../common/decorators/async-handler/async-handler.decorator'
import { ISocket } from '../common/interface/ISocket.interface'
import { applyGuards } from '../common/decorators/guard/apply-guards.decorator'
import { GroupService } from './group/group.service'

import { sendMessage } from './chat/socket/chat-interactions.service'

import isAuthenticatedGuard from '../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../common/guards/auth/is-authorized.guard'
import userExistenceGuard from '../common/guards/user/user-existence.guard'

import connectedUserController from '../common/controllers/connected-users.controller'
import notificationsService from '../common/services/notifications/notifications.service'
import groupExistenceGuard from '../common/guards/group/group-existence.guard'
import { sendGroupMessage } from './group/socket/group-interactions.service'
import groupMembersGuard from '../common/guards/group/group-members.guard'

export const socketIoBootStrap = async (io: Server) => {
  io.use(applyGuards(isAuthenticatedGuard, isAuthorizedGuard)).on(
    'connection',
    asyncHandler(async (socket: ISocket) => {
      const profileId = socket.profile._id

      connectedUserController.setOnline({
        profileId,
        socketId: socket.id,
      })

      await notificationsService.readMissedNotifications({
        userId: profileId,
        socketId: socket.id,
      })

      let rooms: string[] = []

      const groups = await GroupService.getAllChats(profileId)

      if (groups.length) {
        rooms = groups.map(group => group._id.toString())

        console.log({ rooms })

        socket.join(rooms)
      }

      socket.on('disconnect', async () => {
        connectedUserController.setOffline(profileId)

        if (rooms.length) rooms.forEach(room => socket.leave(room))
      })
    }),
  )

  io.of('/chats').use(
    applyGuards(isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard),
  )

  io.of('/chats').on('connection', asyncHandler(sendMessage))

  io.of('/groups').use(
    applyGuards(
      isAuthenticatedGuard,
      isAuthorizedGuard,
      groupExistenceGuard,
      groupMembersGuard,
    ),
  )

  io.of('/groups').on('connection', asyncHandler(sendGroupMessage(io)))
}
