import { model, models } from 'mongoose'
import { ChatGroupSchema } from './ChatGroup.schema'

export const ChatGroupModel =
  models.ChatGroup ?? model('ChatGroup', ChatGroupSchema)
