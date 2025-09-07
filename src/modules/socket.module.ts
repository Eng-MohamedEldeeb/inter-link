import { Server } from "socket.io"

import { asyncHandler } from "../common/decorators/async-handler/async-handler.decorator"
import { ISocket } from "../common/interface/ISocket.interface"
import { applyGuards } from "../common/decorators/guard/apply-guards.decorator"
import { sendMessage } from "./chat/socket/chat-interactions.service"
import { GroupInteractions } from "./group/socket/group-interactions.service"

import isAuthenticatedGuard from "../common/guards/auth/is-authenticated.guard"
import isAuthorizedGuard from "../common/guards/auth/is-authorized.guard"
import userExistenceGuard from "../common/guards/user/user-existence.guard"

import groupService from "./group/group.service"
import connectedUserController from "../common/controllers/connected-users.controller"
import notifyService from "../common/services/notify/notify.service"
import groupExistenceGuard from "../common/guards/group/group-existence.guard"
import groupMembersGuard from "../common/guards/group/group-members.guard"

export const socketIoBootStrap = async (io: Server) => {
  io.use(applyGuards(isAuthenticatedGuard, isAuthorizedGuard)).on(
    "connection",
    asyncHandler(async (socket: ISocket) => {
      const profileId = socket.profile._id
      const groups = await groupService.getAllGroups(profileId)

      connectedUserController.setOnline({
        profileId,
        socketId: socket.id,
      })

      notifyService.readMissedNotifications({
        userId: profileId,
        socketId: socket.id,
      })

      let rooms: string[] = []

      if (groups.length) {
        rooms = groups.map(group => group._id.toString())

        socket.join(rooms)
      }

      socket.on("disconnect", async () => {
        connectedUserController.setOffline(profileId)

        if (rooms.length) rooms.forEach(room => socket.leave(room))
      })
    }),
  )

  io.of("/chats").use(
    applyGuards(isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard),
  )

  io.of("/chats").on("connection", asyncHandler(sendMessage))

  io.of("/groups").use(
    applyGuards(
      isAuthenticatedGuard,
      isAuthorizedGuard,
      groupExistenceGuard,
      groupMembersGuard,
    ),
  )

  io.of("/groups").on(
    "connection",
    asyncHandler(GroupInteractions.sendGroupMessage(io)),
  )
}
