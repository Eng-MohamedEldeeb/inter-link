import { Schema, SchemaTypes } from 'mongoose'
import { IChat } from '../../interfaces/IChat.interface'

export const ChatSchema = new Schema<IChat>(
  {
    messages: {
      type: [
        {
          message: String,
          from: { type: SchemaTypes.ObjectId, ref: 'User' },
          to: { type: SchemaTypes.ObjectId, ref: 'User' },
          sentAt: String,
        },
      ],
    },

    startedBy: { type: SchemaTypes.ObjectId, ref: 'User' },
    messaging: { type: SchemaTypes.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

ChatSchema.virtual('totalMissedMessages').get(function (this: IChat) {
  return this.unread && this.unread.length ? this.unread.length : 0
})
