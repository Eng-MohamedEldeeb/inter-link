import { IMessage } from "../../db/interfaces/IMessage.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../services/db/db.service"
import { TMessage } from "../../db/documents"
import { MessageModel } from "../../db/models/Message/Message.model"

class MessageRepository extends DataBaseService<IMessage, TMessage> {
  constructor(private readonly messageModel: Model<TMessage> = MessageModel) {
    super(messageModel)
  }
}

export default new MessageRepository()
