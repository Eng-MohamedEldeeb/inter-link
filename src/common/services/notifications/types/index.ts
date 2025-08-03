export enum refTo {
  User = 'User',
  Post = 'Post',
  Comment = 'Comment',
  Story = 'Story',
  Chat = 'Chat',
}

export type UserStatus = {
  socketId: string
  isOnline: boolean
  chat: string[]
}
