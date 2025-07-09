import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { IMongoDoc } from './IMongo-doc.interface'
import { MongoId } from '../../common/types/db/db.types'

export interface IStoryInputs {
  content: string
  attachment: ICloudFile
}
export interface IStory extends IStoryInputs, IMongoDoc {
  viewers: MongoId[]
  totalviewers: number
}
