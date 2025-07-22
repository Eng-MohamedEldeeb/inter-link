import { IPayload } from '../utils/security/token/interface/token.interface'
import { IUser } from '../../db/interface/IUser.interface'
import { IStory } from '../../db/interface/IStory.interface'
import { IPost } from '../../db/interface/IPost.interface'
import { IComment } from '../../db/interface/IComment.interface'
import { IReply } from '../../db/interface/IReply.interface'
import { IGroup } from '../../db/interface/IGroup.interface'
import { Socket } from 'socket.io'

export interface ISocket extends Socket {
  tokenPayload: IPayload

  profile: IUser
  user: IUser
  story: IStory
  post: IPost
  comment: IComment
  reply: IReply
  group: IGroup
}
