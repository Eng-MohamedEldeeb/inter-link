import { MongoId } from '../types/db'
import { UserStatus } from '../services/notifications/types'

class ConnectedUserController {
  protected readonly usersStatus = new Map<string, UserStatus>()
  public readonly getUserStatus = (profileId: MongoId) => {
    return this.usersStatus.get(profileId.toString())!
  }

  public readonly setOnline = ({
    profileId,
    socketId,
  }: {
    profileId: MongoId
    socketId: string
  }) => {
    this.usersStatus.set(profileId.toString(), {
      isOnline: true,
      socketId,
    })
  }

  public readonly setOffline = (profileId: MongoId) => {
    const { socketId } = this.getUserStatus(profileId)

    this.usersStatus.set(profileId.toString(), {
      socketId,
      isOnline: false,
    })
  }
}

export default new ConnectedUserController()
