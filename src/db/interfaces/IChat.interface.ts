import { IMongoDoc } from './IMongo-doc.interface'
import { MongoId } from '../../common/types/db'

export interface IMessageDetails {
  _id?: MongoId
  message: string
  from: MongoId
  to: MongoId
  sentAt: string
  likedBy?: MongoId[]
  deletedAt?: Date
  updatedAt?: Date
}

export interface IChat extends IMongoDoc {
  messages: IMessageDetails[]
  unread: IMessageDetails[]

  startedBy: MongoId

  participant: MongoId
}
