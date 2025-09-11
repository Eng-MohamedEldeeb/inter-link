import { Schema, SchemaTypes } from "mongoose"
import { ChatType, IChat } from "../../interfaces/IChat.interface"

const chatMessage = {
  type: SchemaTypes.ObjectId,
  ref: "Message",
}

export const chatSchema = new Schema<IChat>(
  {
    startedBy: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "startedBy id is required"],
    },

    participants: [
      {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: [true, "participant id is required"],
      },
    ],

    type: { type: String, enum: ChatType, default: ChatType.OTO },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

chatSchema.virtual("lastMessage", {
  localField: "_id",
  foreignField: "chatId",
  ref: "Message",
  justOne: true,
})

chatSchema.virtual("newMessages", {
  localField: "_id",
  foreignField: "chatId",
  ref: "Message",
  justOne: true,
})

chatSchema.virtual("totalNewMessages", {
  localField: "_id",
  foreignField: "chatId",
  ref: "Message",
  count: true,
})
