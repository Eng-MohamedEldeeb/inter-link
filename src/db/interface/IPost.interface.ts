import { IMongoDoc } from './IMongo-doc.interface'
import { ICloudFiles } from '../../common/services/upload/interface/cloud-response.interface'
import { MongoId } from '../../common/types/db/db.types'

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
  savedBy: MongoId[]
  totalSaves: number
  shares: number
  archivedAt: Date
}
