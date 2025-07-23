class OnlineUsersController {
  protected readonly onlineUsers = new Map<string, string>()

  public readonly getSocketId = (userId: string): string | undefined => {
    return this.onlineUsers.get(userId)
  }

  public readonly register = ({
    userId,
    socketId,
  }: {
    userId: string
    socketId: string
  }) => {
    this.onlineUsers.set(userId, socketId)
  }

  public readonly remove = (userId: string) => {
    this.onlineUsers.delete(userId)
  }
}

export default new OnlineUsersController()
