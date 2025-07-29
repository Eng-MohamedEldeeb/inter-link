import { IMongoDoc } from './IMongo-doc.interface'
import { MongoId } from '../../common/types/db'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'

export interface IGroupInputs {
  name: string
  description: string
  isPrivateGroup: boolean
  createdBy: MongoId
}

export interface IGroup extends IMongoDoc, IGroupInputs {
  slug: string
  cover: ICloudFile
  posts: MongoId[]
  members: MongoId[]
  totalMembers: number
  admins: MongoId[]
}
