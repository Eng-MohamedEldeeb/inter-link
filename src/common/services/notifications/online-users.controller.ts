import { MongoId } from '../../types/db'
import { UserStatus } from './types'

const usersStatus = new Map<string, UserStatus>()
class ConnectedUsers {
  public readonly getStatus = (profileId: MongoId) => {
    return usersStatus.get(profileId.toString())!
  }

  public readonly setOnline = ({
    profileId,
    socketId,
    inRooms = [],
  }: {
    profileId: MongoId
    socketId: string
    inRooms?: string[] | []
  }) => {
    usersStatus.set(profileId.toString(), {
      isOnline: true,
      socketId,
      inRooms,
    })
  }

  public readonly setOffline = (profileId: MongoId) => {
    const { socketId } = this.getStatus(profileId)

    usersStatus.set(profileId.toString(), {
      socketId,
      isOnline: false,
      inRooms: [],
    })
  }

  public readonly joinChat = ({
    profileId,
    inRooms,
  }: {
    profileId: MongoId
    inRooms: string[]
  }) => {
    const user = this.getStatus(profileId)
    usersStatus.set(profileId.toString(), { ...user, inRooms })
  }

  public readonly leaveChat = (profileId: MongoId) => {
    const user = this.getStatus(profileId)
    usersStatus.set(profileId.toString(), { ...user, inRooms: [] })
  }
}

export default new ConnectedUsers()
