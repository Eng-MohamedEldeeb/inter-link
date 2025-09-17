import { Schema, SchemaTypes } from "mongoose"
import {
  INotification,
  NotificationRefType,
  NotificationStatus,
} from "../interfaces/INotification.interface"
import { DataBaseService } from "../db.service"

export class Notification {
  private static readonly DataBaseService = DataBaseService

  private static readonly schema = new Schema<INotification>(
    {
      message: {
        type: String,
        required: [true, " notification message is required"],
      },

      sender: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: [true, "Sender Id is required"],
      },

      receiver: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: [true, "receiver Id is required"],
      },

      relatedTo: {
        type: SchemaTypes.ObjectId,
        required: [true, "notification relatedTo id is required"],
        ref(this: INotification) {
          return this.ref
        },
      },

      ref: {
        type: String,
        enum: NotificationRefType,
        required: [true, `notification ref is required`],
      },

      status: {
        type: String,
        enum: NotificationStatus,
        default: NotificationStatus.sent,
      },

      sentAt: String,
      receivedAt: Date,
      seenAt: Date,
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    },
  )

  private static schemaFactory = () => {
    return this.schema
  }

  public static readonly Model =
    this.DataBaseService.interactionDB.models[this.name] ??
    this.DataBaseService.interactionDB.model(this.name, this.schemaFactory())
}
