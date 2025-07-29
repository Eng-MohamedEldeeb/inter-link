import { model, models } from 'mongoose'
import { ChatSchema } from './Chat.schema'

export const ChatModel = models.Chat ?? model('Chat', ChatSchema)
