import { Schema, SchemaTypes } from 'mongoose'

import {
  INotification,
  INotificationDetails,
} from '../../interface/INotification.interface'
import { refTo } from '../../types/notification.type'

export const NotificationSchema = new Schema<INotification>(
  {
    belongsTo: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      unique: [true, '"belongsTo" Id already exists'],
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
            ref: function (this: INotificationDetails) {
              return this.refTo
            },
          },

          refTo: {
            type: String,
            enum: refTo,
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
  this: INotification,
) {
  return this.missed && this.missed.length ? this.missed.length : 0
})
