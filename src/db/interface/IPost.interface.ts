import { IMongoDoc } from './IMongo-doc.interface'
import { ICloud } from '../../common/services/upload/interface/cloud-response.interface'
import { MongoObjId } from '../../common/types/db/mongo.types'

export interface IPostInputs {
  attachments: ICloud[]
  title: string
  content: string
  // tags: MongoObjId[]
  onGroup: MongoObjId
}

export interface IPost extends IMongoDoc, IPostInputs {
  createdBy: MongoObjId
  likedBy: MongoObjId[]
  totalLikes: number
  comments: MongoObjId[]
  totalComments: number
  saves: number
  shares: number
  archivedAt: Date
}
