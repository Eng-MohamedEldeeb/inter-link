import { IMongoDoc } from "../../common/interface/IMongo-doc.interface"
import { MongoId } from "../../common/types/db"
import { TMessage } from "../documents"
import { IMessage } from "./IMessage.interface"

export enum ChatType {
  OTO = "OneToOne",
  MTM = "ManyToMany",
}

export interface IChat extends IMongoDoc {
  totalNewMessages: number

  lastMessage: IMessage

  newMessages: TMessage[]

  messages: TMessage[]

  startedBy: MongoId

  participants: MongoId[]

  type: ChatType
}
