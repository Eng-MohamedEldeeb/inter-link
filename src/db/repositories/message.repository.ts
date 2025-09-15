import { IMessage } from "../../db/interfaces/IMessage.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../db.service"
import { TMessage } from "../../db/documents"
import { Message } from "../models"

class MessageRepository extends DataBaseService<IMessage, TMessage> {
  constructor(private readonly messageModel: Model<TMessage> = Message.Model) {
    super(messageModel)
  }
}

export default new MessageRepository()
