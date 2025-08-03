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
    chat = [],
  }: {
    profileId: MongoId
    socketId: string
    chat?: [string, string] | []
  }) => {
    usersStatus.set(profileId.toString(), {
      isOnline: true,
      socketId,
      chat,
    })
  }

  public readonly setOffline = (profileId: MongoId) => {
    const { socketId, isOnline } = this.getStatus(profileId)

    usersStatus.set(profileId.toString(), {
      socketId,
      isOnline: false,
      chat: [],
    })
  }

  public readonly joinChat = ({
    profileId,
    chat,
  }: {
    profileId: MongoId
    chat: [string, string]
  }) => {
    const user = this.getStatus(profileId)

    usersStatus.set(profileId.toString(), { ...user, chat })
  }

  public readonly leaveChat = (profileId: MongoId) => {
    const user = this.getStatus(profileId)
    usersStatus.set(profileId.toString(), { ...user, chat: [] })
  }
}

export default new ConnectedUsers()
