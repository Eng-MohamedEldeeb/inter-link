import { MongoId } from "../types/db"
import { RoomMembers } from "../utils/notify/types"

const roomStatus = new Map<string, RoomMembers>()
class RoomMembersController {
  public readonly getRoomMembers = (chatRoomId: string) => {
    return roomStatus.get(chatRoomId.toString()) ?? []
  }

  public readonly joinChat = ({
    profileId,
    chatRoomId,
  }: {
    profileId: MongoId
    chatRoomId: string | MongoId
  }) => {
    const room = chatRoomId.toString()

    const members = this.getRoomMembers(room)

    const user = profileId.toString()

    members.push(user)

    roomStatus.set(room, members)
  }

  public readonly leaveChat = ({
    profileId,
    chatRoomId,
  }: {
    profileId: MongoId
    chatRoomId: string | MongoId
  }) => {
    const room = chatRoomId.toString()
    const members = this.getRoomMembers(room)

    const filteredMembers = members.filter(member => !profileId.equals(member))

    roomStatus.set(room, filteredMembers)
  }
}
export default new RoomMembersController()
