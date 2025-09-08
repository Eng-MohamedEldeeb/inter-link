import { Schema, SchemaTypes } from "mongoose"
import { ChatType, IChat } from "../../interfaces/IChat.interface"
import { generateCode } from "../../../common/utils/randomstring/generate-code.function"

const chatMessage = {
  message: String,
  sentAt: String,
  from: { type: SchemaTypes.ObjectId, ref: "User" },
  to: { type: SchemaTypes.ObjectId, ref: "User" },
  likedBy: [{ type: SchemaTypes.ObjectId, ref: "User" }],
  updatedAt: Date,
  deletedAt: Date,
}

export const ChatSchema = new Schema<IChat>(
  {
    messages: {
      type: [chatMessage],
    },

    newMessages: {
      type: [chatMessage],
    },

    // chatRoomId: {
    //   type: String,
    //   default: function (this: IChat) {
    //     if (this.type.match(ChatType.OTO))
    //       return `${this.startedBy} ${this.participants[0]}`

    //     return generateCode({ length: 16, charset: "alphanumeric" })
    //   },
    // },

    startedBy: { type: SchemaTypes.ObjectId, ref: "User" },

    participants: [{ type: SchemaTypes.ObjectId, ref: "User" }],

    type: { type: String, enum: ChatType, default: ChatType.OTO },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

ChatSchema.virtual("totalMissedMessages").get(function (this: IChat) {
  return this.newMessages && this.newMessages.length
    ? this.newMessages.length
    : 0
})
