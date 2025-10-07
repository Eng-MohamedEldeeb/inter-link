import {
  ICloudFile,
  ICloudFiles,
} from "../services/upload/interface/cloud-response.interface"

import { Request } from "express"
import { IPayload } from "../utils/security/token/interface/token.interface"
import { IPost } from "../../db/interfaces/IPost.interface"
import { IComment } from "../../db/interfaces/IComment.interface"
import { IReply } from "../../db/interfaces/IReply.interface"
import { IStory } from "../../db/interfaces/IStory.interface"
import { ICommunity } from "../../db/interfaces/ICommunity.interface"
import { TChat, TMessage, TUser } from "../../db/documents"
import { INotification } from "../../db/interfaces/INotification.interface"

export interface IRequest<P = any, Q = any> extends Request<P, any, any, Q> {
  cloudFile: ICloudFile
  cloudFiles: ICloudFiles

  tokenPayload: IPayload

  profile: TUser
  user: TUser
  story: IStory
  post: IPost
  comment: IComment
  reply: IReply
  community: ICommunity
  notification: INotification
  chat: TChat
  message: TMessage
}
