import { ICloudFile } from '../../../common/services/upload/interface/cloud-response.interface'
import { IMongoDoc } from '../../interface/mongo-doc.interface'
import { MongoObjId } from '../../../common/types/mongo.types'

export interface IStoryInputs {
  content: string
  attachment: ICloudFile
}
export interface IStory extends IStoryInputs, IMongoDoc {
  viewers: MongoObjId[]
  totalViewers: number
}
