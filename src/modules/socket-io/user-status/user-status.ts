import { MongoId } from "../../../common/types/db"

export type UserStatus = {
  socketId: string
  isConnected: boolean
}

const usersStatus = new Map<string, UserStatus>()

export class ConnectedUser {
  public static readonly getCurrentStatus = (
    profileId: MongoId,
  ): UserStatus => {
    const userStatus = usersStatus.get(profileId.toString())

    if (userStatus) return userStatus

    return { socketId: "", isConnected: false }
  }

  public static readonly setOnline = ({
    profileId,
    socketId,
  }: {
    profileId: MongoId
    socketId: string
  }) => {
    usersStatus.set(profileId.toString(), {
      isConnected: true,
      socketId,
    })
  }

  public static readonly setOffline = (profileId: MongoId) => {
    const userStatus = usersStatus.get(profileId.toString())

    if (!userStatus) return

    const { socketId } = userStatus

    usersStatus.set(profileId.toString(), {
      socketId,
      isConnected: false,
    })
  }
}
