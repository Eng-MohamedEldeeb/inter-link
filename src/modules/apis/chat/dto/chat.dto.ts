import { MongoId } from "../../../../common/types/db"
import { TChat } from "../../../../db/documents"

export interface IGetSingleChat {
  chatId: MongoId
}

export interface IDeleteChat extends IGetSingleChat {
  profileId: MongoId
  chat: TChat
}

export interface IGetSingleMessage extends IGetSingleChat {
  messageId: MongoId
}
export interface IDeleteMessage extends IGetSingleChat, IGetSingleMessage {
  chat: TChat
}

export interface ILikeMessage extends IGetSingleChat, IGetSingleMessage {}

export interface IEditMessage extends IGetSingleChat, IGetSingleMessage {
  newMessage: string
}
