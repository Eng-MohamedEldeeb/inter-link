import { Request } from 'express'
import { IPayload } from '../utils/security/token/interface/token.interface'
import { IUser } from '../../db/interface/IUser.interface'
import { IPost } from '../../db/interface/IPost.interface'
import { IComment } from '../../db/interface/IComment.interface'
import { IReply } from '../../db/interface/IReply.interface'
import { IStory } from '../../db/interface/IStory.interface'
import { IGroup } from '../../db/interface/IGroup.interface'

import {
  ICloudFile,
  ICloudFiles,
} from '../services/upload/interface/cloud-response.interface'

export interface IRequest<P = any, Q = any> extends Request<P, any, any, Q> {
  tokenPayload: IPayload
  cloudFile: ICloudFile
  cloudFiles: ICloudFiles

  profile: IUser
  user: IUser
  story: IStory
  post: IPost
  comment: IComment
  reply: IReply
  group: IGroup
}
