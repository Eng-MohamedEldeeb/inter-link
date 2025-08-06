import { IChatGroup } from '../../db/interfaces/IChatGroup.interface'
import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TChatGroup } from '../../db/documents'
import { ChatGroupModel } from '../../db/models/ChatGroup/ChatGroup.model'

class ChatGroupRepository extends DataBaseService<IChatGroup, TChatGroup> {
  constructor(
    protected readonly chatGroupModel: Model<TChatGroup> = ChatGroupModel,
  ) {
    super(chatGroupModel)
  }
}

export default new ChatGroupRepository()
