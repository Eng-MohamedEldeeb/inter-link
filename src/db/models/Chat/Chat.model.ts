import { model, models } from "mongoose"
import { chatSchema } from "./Chat.schema"

export const ChatModel = models.Chat ?? model("Chat", chatSchema)
