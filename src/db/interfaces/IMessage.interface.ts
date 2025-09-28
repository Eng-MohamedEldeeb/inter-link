import { IMongoDoc } from "../../common/interface/IMongo-doc.interface"
import { MongoId } from "../../common/types/db"
import { IUser } from "./IUser.interface"

export enum MessageStatus {
  sent = "sent",
  received = "received",
  seen = "seen",
}
export interface IMessageInputs {
  message?: string
  attachment?: string
  receiver: MongoId
  sentAt: string
}

export interface IMessage extends IMessageInputs, IMongoDoc {
  sender: MongoId | IUser
  chatId: MongoId
  seenBy?: (MongoId | IUser)[]
  likedBy?: (MongoId | IUser)[]
  status: MessageStatus

  receivedAt?: Date
  seenAt?: Date
  deletedAt?: Date
}
