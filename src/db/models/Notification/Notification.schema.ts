import { Schema, SchemaTypes } from "mongoose"

import { INotifications } from "./../../interfaces/INotification.interface"
import { INotificationInputs } from "../../interfaces/INotification.interface"
import { RefTypes } from "../../../common/utils/notify/types"

export const NotificationSchema = new Schema<INotifications>(
  {
    belongsTo: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      unique: [true, '"belongsTo" Id already exists'],
    },

    newMessages: {
      type: [
        {
          from: {
            type: SchemaTypes.ObjectId,
            ref: "User",
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
          attachment: { type: String },
          sentAt: String,
          updatedAt: Date,
        },
      ],
    },

    newNotifications: {
      type: [
        {
          message: {
            type: String,
          },

          content: String,

          from: {
            type: SchemaTypes.ObjectId,
            ref: "User",
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

          sentAt: String,
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
            ref: "User",
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
          sentAt: String,
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

NotificationSchema.virtual("totalNewNotifications").get(function (
  this: INotifications,
) {
  return this.newNotifications && this.newNotifications.length
    ? this.newNotifications.length
    : 0
})

NotificationSchema.virtual("totalMissedMessages").get(function (
  this: INotifications,
) {
  return this.newNotifications && this.newNotifications.length
    ? this.newNotifications.length
    : 0
})
