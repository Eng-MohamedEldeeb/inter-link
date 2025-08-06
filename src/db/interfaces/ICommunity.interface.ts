import { IMongoDoc } from '../../common/interface/IMongo-doc.interface'
import { MongoId } from '../../common/types/db'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'

export interface ICommunityInputs {
  name: string
  description: string
  isPrivateCommunity: boolean
  createdBy: MongoId
}

export interface ICommunity extends IMongoDoc, ICommunityInputs {
  slug: string
  cover: ICloudFile
  posts: MongoId[]
  members: MongoId[]
  totalMembers: number
  admins: MongoId[]
}
