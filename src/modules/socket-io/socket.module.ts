import { Server } from "socket.io"
import { applyGuards } from "../../common/decorators/guard/apply-guards.decorator"

import {
  isAuthenticatedGuard,
  isAuthorizedGuard,
  userExistenceGuard,
} from "../../common/guards"

import { socketConnection } from "./socket.controller"
import { chatConnection } from "./chat/chat.controller"

export const socketIoBootStrap = async (io: Server) => {
  io.use(applyGuards(isAuthenticatedGuard, isAuthorizedGuard))

  io.on("connection", socketConnection)

  io.of("/chats").use(
    applyGuards(isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard),
  )

  io.of("/chats").on("connection", chatConnection)
}
