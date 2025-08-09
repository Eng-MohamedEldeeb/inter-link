import { MongoId } from '../types/db'
import { RoomMembers } from '../services/notifications/types'

const roomStatus = new Map<string, RoomMembers>()
class RoomMembersController {
  public readonly getRoomMembers = (roomId: string) => {
    return roomStatus.get(roomId) ?? []
  }
  public readonly joinChat = ({
    profileId,
    roomId,
  }: {
    profileId: MongoId
    roomId: string
  }) => {
    const members = this.getRoomMembers(roomId)

    const user = profileId.toString()
    members.push(user)

    roomStatus.set(roomId, members)
  }

  public readonly leaveChat = ({
    profileId,
    roomId,
  }: {
    profileId: MongoId
    roomId: string
  }) => {
    const members = this.getRoomMembers(roomId)

    const filteredMembers = members.filter(member => !profileId.equals(member))

    roomStatus.set(roomId, filteredMembers)
  }
}
export default new RoomMembersController()
