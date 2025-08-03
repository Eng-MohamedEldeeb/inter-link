import { Request } from 'express'
import { IPayload } from '../utils/security/token/interface/token.interface'
import { IUser } from '../../db/interfaces/IUser.interface'
import { IPost } from '../../db/interfaces/IPost.interface'
import { IComment } from '../../db/interfaces/IComment.interface'
import { IReply } from '../../db/interfaces/IReply.interface'
import { IStory } from '../../db/interfaces/IStory.interface'
import { IGroup } from '../../db/interfaces/IGroup.interface'

import {
  ICloudFile,
  ICloudFiles,
} from '../services/upload/interface/cloud-response.interface'
import {
  INotifications,
  INotificationSlice,
} from '../../db/interfaces/INotification.interface'

import { IChat } from '../../db/interfaces/IChat.interface'

export interface IRequest<P = any, Q = any> extends Request<P, any, any, Q> {
  cloudFile: ICloudFile
  cloudFiles: ICloudFiles

  tokenPayload: IPayload

  profile: IUser
  user: IUser
  story: IStory
  post: IPost
  comment: IComment
  reply: IReply
  group: IGroup
  notifications: INotifications
  notification: INotificationSlice
  chat: IChat
}
