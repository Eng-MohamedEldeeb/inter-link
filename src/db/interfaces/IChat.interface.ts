import { IMongoDoc } from '../../common/interface/IMongo-doc.interface'
import { MongoId } from '../../common/types/db'

export interface IMessageInputs {
  message: string
  to: MongoId
}

export interface IMessageDetails extends IMessageInputs {
  _id?: MongoId
  from: MongoId
  sentAt: string
  likedBy?: MongoId[]
  deletedAt?: Date
  updatedAt?: Date
}

export interface IChat extends IMongoDoc {
  messages: IMessageDetails[]
  newMessages: IMessageDetails[]

  startedBy: MongoId

  participant: MongoId
}
