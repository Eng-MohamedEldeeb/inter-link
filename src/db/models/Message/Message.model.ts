import { model, models } from "mongoose"
import { messageSchema } from "./Message.schema"

export const MessageModel = models.Message ?? model("Message", messageSchema)
