import { Schema, SchemaTypes } from 'mongoose'
import { IChat } from '../../interfaces/IChat.interface'

export const ChatSchema = new Schema<IChat>(
  {
    messages: {
      type: [
        {
          message: String,
          sentAt: String,
          from: { type: SchemaTypes.ObjectId, ref: 'User' },
          to: { type: SchemaTypes.ObjectId, ref: 'User' },
          likedBy: [{ type: SchemaTypes.ObjectId, ref: 'User' }],
          updatedAt: Date,
          deletedAt: Date,
        },
      ],
    },

    unread: {
      type: [
        {
          message: String,
          sentAt: String,
          from: { type: SchemaTypes.ObjectId, ref: 'User' },
          to: { type: SchemaTypes.ObjectId, ref: 'User' },
          likedBy: [{ type: SchemaTypes.ObjectId, ref: 'User' }],
          updatedAt: Date,
          deletedAt: Date,
        },
      ],
    },

    startedBy: { type: SchemaTypes.ObjectId, ref: 'User' },
    participant: { type: SchemaTypes.ObjectId, ref: 'User' },
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
