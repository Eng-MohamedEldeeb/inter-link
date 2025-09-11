import { IMongoDoc } from "../../common/interface/IMongo-doc.interface"
import { MongoId } from "../../common/types/db"
import { IMessage } from "./IMessage.interface"

export enum ChatType {
  OTO = "OneToOne",
  MTM = "ManyToMany",
}

export interface IChat extends IMongoDoc {
  lastMessage: IMessage

  newMessages: IMessage[]

  startedBy: MongoId

  participants: MongoId[]

  type: ChatType
}
