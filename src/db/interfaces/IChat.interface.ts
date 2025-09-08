import { IMongoDoc } from "../../common/interface/IMongo-doc.interface"
import { MongoId } from "../../common/types/db"
import { IUser } from "./IUser.interface"

export enum ChatType {
  OTO = "OneToOne",
  MTM = "ManyToMany",
}
export interface IMessageInputs {
  message: string
  attachment?: string
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

  participants: MongoId[]

  // chatRoomId: string

  type: ChatType
}
