import { Schema, SchemaTypes } from 'mongoose'

import { INotifications } from './../../interfaces/INotification.interface'
import { INotificationInputs } from '../../interfaces/INotification.interface'
import { refTo } from '../../../common/services/notifications/types'

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
          title: {
            type: String,
          },

          content: String,

          from: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
          },

          sentAt: String,
        },
      ],
    },

    missed: {
      type: [
        {
          title: {
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
            enum: refTo,
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
          title: {
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
            enum: refTo,
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
  return this.missed && this.missed.length ? this.missed.length : 0
})
