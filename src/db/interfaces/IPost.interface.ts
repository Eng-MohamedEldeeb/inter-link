import { ICloudFiles } from '../../common/services/upload/interface/cloud-response.interface'
import { IMongoDoc } from './IMongo-doc.interface'
import { MongoId } from '../../common/types/db'

export interface IPostInputs {
  title: string
  content: string
  // tags: MongoId[]
  onGroup: MongoId
}

export interface IPost extends IMongoDoc, IPostInputs {
  attachments: ICloudFiles
  createdBy: MongoId
  likedBy: MongoId[]
  totalLikes: number
  comments: MongoId[]
  totalComments: number
  totalSaves: number
  shares: number
  archivedAt: Date
}
