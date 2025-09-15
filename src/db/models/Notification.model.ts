import { Schema, SchemaTypes, model, models } from "mongoose"
import {
  INotification,
  NotificationRefType,
  NotificationStatus,
} from "../interfaces/INotification.interface"

export class Notification {
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
    models.Notification ?? model(this.name, this.schemaFactory())
}
