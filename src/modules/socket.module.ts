import { Server } from "socket.io"
import { asyncHandler } from "../common/decorators/async-handler/async-handler.decorator"
import { ISocket } from "../common/interface/ISocket.interface"
import { applyGuards } from "../common/decorators/guard/apply-guards.decorator"
import { GroupInteractions } from "./group/socket/group-interactions.service"

import {
  isAuthenticatedGuard,
  isAuthorizedGuard,
  userExistenceGuard,
} from "../common/guards"

import chatInteractions from "./chat/socket/chat-interactions.service"
import groupService from "./group/group.service"
import notifyService from "../common/services/notify/notify.service"
import groupExistenceGuard from "../common/guards/group/group-existence.guard"
import groupMembersGuard from "../common/guards/group/group-members.guard"
import userService from "./user/user.service"

export const socketIoBootStrap = async (io: Server) => {
  io.use(applyGuards(isAuthenticatedGuard, isAuthorizedGuard)).on(
    "connection",
    asyncHandler(async (socket: ISocket) => {
      const profileId = socket.profile._id

      userService.setOnline({
        profileId,
        socketId: socket.id,
      })

      const groups = await groupService.getAllGroups(profileId)

      let rooms: string[] = []

      if (groups.length) {
        rooms = groups.map(group => group._id.toString())

        socket.join(rooms)
      }

      notifyService.readMissedNotifications({
        userId: profileId,
        socketId: socket.id,
      })

      socket.on("disconnect", async () => {
        userService.setOffline(profileId)

        if (rooms.length) rooms.forEach(room => socket.leave(room))
      })
    }),
  )

  io.of("/chats").use(
    applyGuards(isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard),
  )

  io.of("/chats").on("connection", asyncHandler(chatInteractions.connect))

  // io.of("/groups").use(
  //   applyGuards(
  //     isAuthenticatedGuard,
  //     isAuthorizedGuard,
  //     groupExistenceGuard,
  //     groupMembersGuard,
  //   ),
  // )

  // io.of("/groups").on(
  //   "connection",
  //   asyncHandler(GroupInteractions.sendGroupMessage(io)),
  // )
}
