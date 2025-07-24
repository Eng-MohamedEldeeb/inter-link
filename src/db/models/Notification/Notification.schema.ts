import { INotifications } from './../../interface/INotification.interface'
import { Schema, SchemaTypes } from 'mongoose'

import { INotificationDetails } from '../../interface/INotification.interface'
import { refTo } from '../../types/notification.type'

export const NotificationSchema = new Schema<INotifications>(
  {
    belongsTo: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      unique: [true, '"belongsTo" Id already exists'],
    },

    received: {
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
            ref: function (this: INotificationDetails) {
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
            ref: function (this: INotificationDetails) {
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

NotificationSchema.virtual('totalReceivedNotifications').get(function (
  this: INotifications,
) {
  return this.received && this.received.length ? this.received.length : 0
})
