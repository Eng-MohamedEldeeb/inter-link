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

    newMessages: {
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

    roomId: {
      type: String,
      default: function (this: IChat) {
        return `${this.startedBy.toString()} ${this.participant.toString()}`
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

ChatSchema.virtual('totalMissedMessages').get(function (this: IChat) {
  return this.newMessages && this.newMessages.length
    ? this.newMessages.length
    : 0
})
