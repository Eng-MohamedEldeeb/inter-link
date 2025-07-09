import { IMongoDoc } from './IMongo-doc.interface'
import { ICloud } from '../../common/services/upload/interface/cloud-response.interface'
import { MongoId } from '../../common/types/db/db.types'

export interface IPostInputs {
  attachments: ICloud[]
  title: string
  content: string
  // tags: MongoId[]
  onGroup: MongoId
}

export interface IPost extends IMongoDoc, IPostInputs {
  createdBy: MongoId
  likedBy: MongoId[]
  totalLikes: number
  comments: MongoId[]
  totalComments: number
  saves: MongoId[]
  totalSaves: number
  shares: number
  archivedAt: Date
}
