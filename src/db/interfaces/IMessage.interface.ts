import { IMongoDoc } from "../../common/interface/IMongo-doc.interface"
import { MongoId } from "../../common/types/db"

export interface IMessageInputs {
  message?: string
  attachment?: string
  to: MongoId
}

export interface IMessage extends IMessageInputs, IMongoDoc {
  from: MongoId
  chatId: MongoId
  sentAt: string
  seenBy?: MongoId[]
  likedBy?: MongoId[]
  deletedAt?: Date
}
