import { Types } from 'mongoose'
import { ICloudFile } from '../../../common/services/upload/interface/cloud-response.interface'
import { IMongoDoc } from '../../interface/mongo-doc.interface'

export interface IStoryInputs {
  content: string
  attachment: ICloudFile
}
export interface IStory extends IStoryInputs, IMongoDoc {
  viewers: Types.ObjectId[]
  totalViewers: number
}
