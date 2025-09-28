import { MongoId } from "../../../../common/types/db"
import { TChat } from "../../../../db/documents"

export interface IGetSingleChat {
  chatId: MongoId
}

export interface IMessageDetail {
  chatId: MongoId
  messageId: MongoId
}

export interface IDeleteChat extends IGetSingleChat {
  profileId: MongoId
  chat: TChat
}

export interface ILikeMessage extends IMessageDetail {}

export interface IDeleteMessage extends IMessageDetail {}

export interface IEditMessage extends IMessageDetail {
  newMessage: string
}
