import { IMongoDoc } from '../../common/interface/IMongo-doc.interface'
import { MongoId } from '../../common/types/db'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'

export interface IMessageInputs {
  message: string
  replyingTo?: MongoId
}

export interface IChatGroupMessageDetails extends IMessageInputs {
  _id?: MongoId
  from: MongoId
  sentAt: string
  likedBy?: MongoId[]
  deletedAt?: Date
  updatedAt?: Date
}

export interface IChatGroupInputs {
  name: string
  description: string
  createdBy: MongoId
}

export interface IChatGroup extends IMongoDoc, IChatGroupInputs {
  cover: ICloudFile
  members: MongoId[]
  totalMembers: number
  messages: IChatGroupMessageDetails[]
}
