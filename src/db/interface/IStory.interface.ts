import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { IMongoDoc } from './IMongo-doc.interface'
import { MongoId } from '../../common/types/db/db.types'

export interface IStoryInputs {
  content: string
  createdBy: MongoId
}
export interface IStory extends IStoryInputs, IMongoDoc {
  attachment: ICloudFile
  viewers: MongoId[]
  totalViewers: number
}
