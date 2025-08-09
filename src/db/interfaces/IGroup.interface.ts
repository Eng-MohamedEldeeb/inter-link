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
  groupName: string
  description: string
  members: MongoId[]
  createdBy: MongoId
}

export interface IGroup extends IMongoDoc, IGroupInputs {
  cover: ICloudFile
  totalMembers: number
  messages: IGroupMessageDetails[]
}
