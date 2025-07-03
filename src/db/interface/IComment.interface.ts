import { IMongoDoc } from './IMongo-doc.interface'
import { MongoObjId } from '../../common/types/db/mongo.types'

export interface ICommentInputs {
  onPost: MongoObjId
  content: string
  createdBy: MongoObjId
  replyingTo: MongoObjId
}

export interface IComment extends IMongoDoc, ICommentInputs {
  likedBy: MongoObjId[]
  totalLikes: number
  replies: MongoObjId[]
  repliesCount: number
}
