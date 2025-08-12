import { Schema, SchemaTypes } from 'mongoose'

import { INotifications } from './../../interfaces/INotification.interface'
import { INotificationInputs } from '../../interfaces/INotification.interface'
import { RefTypes } from '../../../common/services/notifications/types'

export const NotificationSchema = new Schema<INotifications>(
  {
    belongsTo: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      unique: [true, '"belongsTo" Id already exists'],
    },

    missedMessages: {
      type: [
        {
          from: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
          },
          message: {
            type: String,
          },
          messageId: {
            type: SchemaTypes.ObjectId,
            ref: function (this: INotificationInputs) {
              return this.refTo
            },
          },

          refTo: {
            type: String,
            enum: [RefTypes.Chat, RefTypes.Group],
          },
          sentAt: String,
          updatedAt: Date,
        },
      ],
    },

    missedNotifications: {
      type: [
        {
          message: {
            type: String,
          },

          content: String,

          from: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
          },

          on: {
            type: SchemaTypes.ObjectId,
            ref: function (this: INotificationInputs) {
              return this.refTo
            },
          },

          refTo: {
            type: String,
            enum: RefTypes,
          },

          createdAt: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
    },

    seen: {
      type: [
        {
          message: {
            type: String,
          },

          content: String,

          from: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
          },

          on: {
            type: SchemaTypes.ObjectId,
            ref: function (this: INotificationInputs) {
              return this.refTo
            },
          },

          refTo: {
            type: String,
            enum: RefTypes,
          },

          createdAt: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

NotificationSchema.virtual('totalMissedNotifications').get(function (
  this: INotifications,
) {
  return this.missedNotifications && this.missedNotifications.length
    ? this.missedNotifications.length
    : 0
})

NotificationSchema.virtual('totalMissedMessages').get(function (
  this: INotifications,
) {
  return this.missedNotifications && this.missedNotifications.length
    ? this.missedNotifications.length
    : 0
})
