import { IMongoDoc } from './IMongo-doc.interface'
import { MongoId } from '../../common/types/db/db.types'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'

export interface ICommentInputs {
  onPost: MongoId
  content: string
  createdBy: MongoId
  replyingTo: MongoId
}

export interface IComment extends IMongoDoc, ICommentInputs {
  attachment?: ICloudFile
  likedBy: MongoId[]
  totalLikes: number
  replies: MongoId[]
  repliesCount: number
}
