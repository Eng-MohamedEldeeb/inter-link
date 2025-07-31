import { MongoId } from '../../../common/types/db'

export interface IGetSingleChat {
  currentChatId: MongoId
}

export interface ISendMessage {
  userId: MongoId
  profileId: MongoId
  message: string
}

export interface IDeleteChat extends IGetSingleChat {
  profileId: MongoId
}

export interface IDeleteMessage extends IGetSingleChat {
  messageId: MongoId
}

export interface ILikeMessage extends IDeleteMessage {}
