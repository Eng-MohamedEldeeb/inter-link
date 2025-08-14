import { IMongoDoc } from '../../common/interface/IMongo-doc.interface'
import { MongoId } from '../../common/types/db'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'

export interface IMessageInputs {
  message: string
  replyingTo?: MongoId
}

export interface IGroupMessageDetails extends IMessageInputs {
  _id?: MongoId
  from: MongoId
  sentAt: string
  likedBy?: MongoId[]
  deletedAt?: Date
  updatedAt?: Date
}

export interface IGroupInputs {
  name: string
  description: string
  members: MongoId[]
  createdBy: MongoId
  cover: ICloudFile
}

export interface IGroup extends IMongoDoc, IGroupInputs {
  totalMembers: number
  messages: IGroupMessageDetails[]
}
