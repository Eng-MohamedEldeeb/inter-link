import { MongoId } from '../../../common/types/db'
import { IUser } from '../../../db/interfaces/IUser.interface'

export interface IGetSingleChat {
  currentChatId: MongoId
}

export interface ISendMessage {
  message: string
  from: IUser
  sentAt: string
}

export interface IDeleteChat extends IGetSingleChat {
  profileId: MongoId
}

export interface IDeleteMessage extends IGetSingleChat {
  messageId: MongoId
}

export interface ILikeMessage extends IDeleteMessage {}
