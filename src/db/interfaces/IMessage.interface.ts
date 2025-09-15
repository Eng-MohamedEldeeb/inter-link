import { IMongoDoc } from "../../common/interface/IMongo-doc.interface"
import { MongoId } from "../../common/types/db"

export enum MessageStatus {
  sent = "sent",
  received = "received",
  seen = "seen",
}
export interface IMessageInputs {
  message?: string
  attachment?: string
  receiver: MongoId
}

export interface IMessage extends IMessageInputs, IMongoDoc {
  sender: MongoId
  chatId: MongoId
  seenBy?: MongoId[]
  likedBy?: MongoId[]
  status: MessageStatus

  sentAt: string

  receivedAt?: Date
  seenAt?: Date
  deletedAt?: Date
}
