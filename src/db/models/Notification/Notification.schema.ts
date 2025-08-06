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
          from: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
          },

          messages: {
            type: [
              {
                notificationMessage: {
                  type: String,
                },
                sentAt: String,
                updatedAt: Date,
              },
            ],
          },
        },
      ],
    },

    missedNotifications: {
      type: [
        {
          notificationMessage: {
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
          notificationMessage: {
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
