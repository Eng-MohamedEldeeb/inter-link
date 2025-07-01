import { IMongoDoc } from '../../interface/mongo-doc.interface'
import { MongoObjId } from '../../../common/types/mongo.types'

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
