import { Schema, SchemaTypes, model, models } from "mongoose"
import { IMessage, MessageStatus } from "../interfaces/IMessage.interface"

export class Message {
  private static readonly schema = new Schema<IMessage>(
    {
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

      chatId: {
        type: SchemaTypes.ObjectId,
        ref: "Chat",
        required: [true, "chat Id is required"],
      },

      attachment: { type: String },

      message: {
        type: String,
        required: [
          function () {
            return this.attachment ? false : true
          },
          "message is required",
        ],
      },

      sentAt: { type: String, required: [true, "sentAt Field is required"] },

      seenBy: [
        {
          type: SchemaTypes.ObjectId,
          ref: "User",
          required: [true, "receiver Id is required"],
        },
      ],

      likedBy: [
        {
          type: SchemaTypes.ObjectId,
          ref: "User",
          required: [true, "receiver Id is required"],
        },
      ],

      status: {
        type: String,
        enum: MessageStatus,
        default: MessageStatus.sent,
      },

      seenAt: Date,
      receivedAt: Date,
      deletedAt: Date,
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    },
  )

  private static readonly schemaFactory = () => {
    return this.schema
  }

  public static readonly Model =
    models.Message ?? model(this.name, this.schemaFactory())
}
