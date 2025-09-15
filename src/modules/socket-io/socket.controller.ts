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

  // const groups = await groupService.getAllGroups(profileId)

  let rooms: string[] = []

  // if (groups.length) {
  //   rooms = groups.map(group => group._id.toString())

  //   socket.join(rooms)
  // }

  Notify.readNewNotifications({
    receiverId: profileId,
    socketId: socket.id,
  })

  socket.on("disconnect", () => {
    ConnectedUser.setOffline(profileId)

    if (rooms.length) rooms.forEach(room => socket.leave(room))
  })
})
