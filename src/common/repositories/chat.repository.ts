import { IChat } from '../../db/interfaces/IChat.interface'
import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TChat } from '../../db/documents'
import { ChatModel } from '../../db/models/Chat/Chat.model'

class ChatRepository extends DataBaseService<IChat, TChat> {
  constructor(protected readonly chatModel: Model<TChat> = ChatModel) {
    super(chatModel)
  }
}

export default new ChatRepository()
