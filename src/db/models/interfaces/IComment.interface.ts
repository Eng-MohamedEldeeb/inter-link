import { Types } from 'mongoose'
import { IMongoDoc } from '../../interface/mongo-doc.interface'

export interface ICommentInputs {
  onPost: Types.ObjectId
  content: string
  createdBy: Types.ObjectId
  replyingTo: Types.ObjectId
}

export interface IComment extends IMongoDoc, ICommentInputs {
  likedBy: Types.ObjectId[]
  totalLikes: number
  replies: Types.ObjectId[]
  repliesCount: number
}
