import { Schema, SchemaTypes } from "mongoose"
import { IMessage } from "../../interfaces/IMessage.interface"

export const messageSchema = new Schema<IMessage>(
  {},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
