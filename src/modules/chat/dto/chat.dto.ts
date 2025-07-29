import { MongoId } from '../../../common/types/db'
import { IMessageDetails } from '../../../db/interfaces/IChat.interface'

export interface IGetSingleChat {
  chatId: MongoId
}

export interface IStartChat {
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
