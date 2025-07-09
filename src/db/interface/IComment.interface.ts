import { IMongoDoc } from './IMongo-doc.interface'
import { MongoId } from '../../common/types/db/db.types'

export interface ICommentInputs {
  onPost: MongoId
  content: string
  createdBy: MongoId
  replyingTo: MongoId
}

export interface IComment extends IMongoDoc, ICommentInputs {
  likedBy: MongoId[]
  totalLikes: number
  replies: MongoId[]
  repliesCount: number
}
