import { IMongoDoc } from './IMongo-doc.interface'
import { MongoId } from '../../common/types/db'

export interface IMessageDetails {
  message: string
  from: MongoId
  to: MongoId
  sentAt: string
}

export interface IChat extends IMongoDoc {
  messages: IMessageDetails[]
  unread: IMessageDetails[]

  startedBy: MongoId

  messaging: MongoId
}
