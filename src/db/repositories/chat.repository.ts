import { IChat } from "../../db/interfaces/IChat.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../db.service"
import { TChat } from "../../db/documents"
import { Chat } from "../models"

class ChatRepository extends DataBaseService<IChat, TChat> {
  constructor(private readonly chatModel: Model<TChat> = Chat.Model) {
    super(chatModel)
  }
}

export default new ChatRepository()
