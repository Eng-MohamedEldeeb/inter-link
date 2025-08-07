import { MongoId } from '../types/db'
import { RoomMembers } from '../services/notifications/types'

class RoomMembersController {
  protected readonly roomStatus = new Map<string, RoomMembers>()
  public readonly getRoomMembers = (roomId: string) => {
    return this.roomStatus.get(roomId) ?? []
  }
  public readonly joinChat = ({
    profileId,
    roomId,
  }: {
    profileId: MongoId
    roomId: string
  }) => {
    const members = this.getRoomMembers(roomId)
    this.roomStatus.set(roomId, [profileId.toString(), ...members])
  }

  public readonly leaveChat = ({
    profileId,
    roomId,
  }: {
    profileId: MongoId
    roomId: string
  }) => {
    const members = this.getRoomMembers(roomId)
    const filteredMembers = members
      ? members.filter(member => !profileId.equals(member))
      : []
    this.roomStatus.set(roomId, filteredMembers)
  }
}
export default new RoomMembersController()
