export enum NotificationType {
  newNotifications = 'new-notifications',
  newMessage = 'new-message',
  newGroupMessage = 'new-group-message',
}

export enum RefTypes {
  User = 'User',
  Post = 'Post',
  Comment = 'Comment',
  Community = 'Community',
  Story = 'Story',
  Chat = 'Chat',
  Group = 'Group',
}

export type ReftTo = keyof typeof RefTypes

export type UserStatus = {
  socketId: string
  isOnline: boolean
}

export type RoomMembers = string[]
