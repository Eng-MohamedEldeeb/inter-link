import { UserStatus } from './types'

class ConnectedUsers {
  protected readonly users = new Map<string, UserStatus>()

  public readonly getStatus = (userId: string): UserStatus => {
    return this.users.get(userId.toString())!
  }

  public readonly setOnline = ({
    userId,
    socketId,
  }: {
    userId: string
    socketId: string
  }) => {
    this.users.set(userId, { socketId, isOnline: true })
  }

  public readonly setOffline = (userId: string) => {
    const { socketId } = this.getStatus(userId)

    this.users.set(userId, { socketId, isOnline: false })
  }
}

export default new ConnectedUsers()
