import { Types } from 'mongoose'
import { IMongoDoc } from '../../interface/mongo-doc.interface'
import { ICloudFiles } from '../../../http/common/services/upload/interface/cloud-response.interface'

export interface IPostInputs {
  title: string
  content: string
  attachments: ICloudFiles[]
  // tags: Types.ObjectId[]
  createdBy: Types.ObjectId
  onGroup: Types.ObjectId
}

export interface IPost extends IMongoDoc, IPostInputs {
  totalLikes: number
  likedBy: Types.ObjectId[]
  comments: Types.ObjectId[]
  totalComments: number
  saves: number
  shares: number
}
