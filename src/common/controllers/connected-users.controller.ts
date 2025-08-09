import { MongoId } from '../types/db'
import { UserStatus } from '../services/notifications/types'

const usersStatus = new Map<string, UserStatus>()
class ConnectedUserController {
  public readonly getUserStatus = (profileId: MongoId) => {
    return usersStatus.get(profileId.toString())!
  }

  public readonly setOnline = ({
    profileId,
    socketId,
  }: {
    profileId: MongoId
    socketId: string
  }) => {
    usersStatus.set(profileId.toString(), {
      isOnline: true,
      socketId,
    })
  }

  public readonly setOffline = (profileId: MongoId) => {
    const { socketId } = this.getUserStatus(profileId)

    usersStatus.set(profileId.toString(), {
      socketId,
      isOnline: false,
    })
  }
}

export default new ConnectedUserController()
