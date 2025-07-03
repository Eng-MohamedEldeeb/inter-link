import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { IMongoDoc } from './IMongo-doc.interface'
import { MongoObjId } from '../../common/types/db/mongo.types'

export interface IStoryInputs {
  content: string
  attachment: ICloudFile
}
export interface IStory extends IStoryInputs, IMongoDoc {
  viewers: MongoObjId[]
  totalviewers: number
}
