import { MongoId } from "../types/db"
import { RoomMembers } from "../utils/notify/types"

const roomStatus = new Map<string, RoomMembers>()
class RoomMembersController {
  public readonly getRoomMembers = (roomId: string) => {
    return roomStatus.get(roomId.toString()) ?? []
  }
  public readonly joinChat = ({
    profileId,
    roomId,
  }: {
    profileId: MongoId
    roomId: string | MongoId
  }) => {
    const room = roomId.toString()

    const members = this.getRoomMembers(room)

    const user = profileId.toString()

    members.push(user)

    roomStatus.set(room, members)
  }

  public readonly leaveChat = ({
    profileId,
    roomId,
  }: {
    profileId: MongoId
    roomId: string | MongoId
  }) => {
    const room = roomId.toString()
    const members = this.getRoomMembers(room)

    const filteredMembers = members.filter(member => !profileId.equals(member))

    roomStatus.set(room, filteredMembers)
  }
}
export default new RoomMembersController()
