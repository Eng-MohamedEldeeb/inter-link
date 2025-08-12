import { MongoId } from '../types/db'
import { UserStatus } from '../services/notifications/types'

const usersStatus = new Map<string, UserStatus>()
class ConnectedUserController {
  public readonly getUserStatus = (profileId: MongoId): UserStatus => {
    const userStatus = usersStatus.get(profileId.toString())

    if (userStatus) return userStatus

    return { socketId: '', isOnline: false }
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
    const userStatus = this.getUserStatus(profileId)

    if (!userStatus) return

    const { socketId } = userStatus

    usersStatus.set(profileId.toString(), {
      socketId,
      isOnline: false,
    })
  }
}

export default new ConnectedUserController()
