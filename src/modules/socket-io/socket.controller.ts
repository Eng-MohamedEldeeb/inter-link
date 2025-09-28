import { asyncHandler } from "../../common/decorators"
import { ISocket } from "../../common/interface/ISocket.interface"
import { ConnectedUser } from "./user-status/user-status"
import { Notify } from "../../common/services/notify/notify.event"

export const socketConnection = asyncHandler(async (socket: ISocket) => {
  const profileId = socket.profile._id

  ConnectedUser.setOnline({
    profileId,
    socketId: socket.id,
  })

  Notify.readNewNotifications({
    receiver: profileId,
    socketId: socket.id,
  })

  socket.on("disconnect", () => {
    ConnectedUser.setOffline(profileId)
  })
})
