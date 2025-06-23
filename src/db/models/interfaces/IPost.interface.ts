import { Types } from 'mongoose'
import { IMongoDoc } from '../../interface/mongo-doc.interface'

export interface IPostInputs {
  title: string
  content: string
  attachments: Object[]
  // tags: Types.ObjectId[]
  createdBy: Types.ObjectId
  onGroup: Types.ObjectId
}

export interface IPost extends IMongoDoc, IPostInputs {
  likesCount: number
  likedBy: Types.ObjectId[]
  comments: Types.ObjectId[]
  commentsCount: number
  saves: number
  shares: number
}
