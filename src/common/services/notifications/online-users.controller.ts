import { MongoId } from '../../types/db'
import { UserStatus } from './types'

class ConnectedUsers {
  protected readonly users = new Map<string, UserStatus>()

  public readonly getStatus = (profileId: MongoId) => {
    return this.users.get(profileId.toString())!
  }

  public readonly setOnline = ({
    profileId,
    socketId,
    chat,
  }: {
    profileId: MongoId
    socketId: string
    chat?: [string, string]
  }) => {
    return this.users.set(profileId.toString(), {
      socketId,
      isOnline: true,
      chat,
    })
  }

  public readonly setOffline = (profileId: MongoId) => {
    const { socketId } = this.getStatus(profileId)

    return this.users.set(profileId.toString(), {
      socketId,
      isOnline: true,
    })
  }

  public readonly joinChat = ({
    profileId,
    chat,
  }: {
    profileId: MongoId
    chat: [string, string]
  }) => {
    const { socketId } = this.getStatus(profileId)
    return this.setOnline({ profileId, socketId, chat: chat })
  }

  public readonly leaveChat = (profileId: MongoId) => {
    const { socketId } = this.getStatus(profileId)
    return this.setOnline({ profileId, socketId, chat: undefined })
  }
}

export default new ConnectedUsers()
