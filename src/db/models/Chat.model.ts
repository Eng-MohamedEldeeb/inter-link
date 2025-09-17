import { Schema, SchemaTypes } from "mongoose"
import { ChatType, IChat } from "../interfaces/IChat.interface"
import { DataBaseService } from "../db.service"

export class Chat {
  private static readonly DataBaseService = DataBaseService

  private static readonly schema = new Schema<IChat>(
    {
      startedBy: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: [true, "startedBy id is required"],
      },

      participants: [
        {
          type: SchemaTypes.ObjectId,
          ref: "User",
          required: [true, "participant id is required"],
        },
      ],

      type: { type: String, enum: ChatType, default: ChatType.OTO },
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    },
  )

  private static readonly schemaFactory = () => {
    this.schema.virtual("lastMessage", {
      localField: "_id",
      foreignField: "chatId",
      ref: "Message",
      justOne: true,
    })

    this.schema.virtual("newMessages", {
      localField: "_id",
      foreignField: "chatId",
      ref: "Message",
      justOne: true,
    })

    this.schema.virtual("totalNewMessages", {
      localField: "_id",
      foreignField: "chatId",
      ref: "Message",
      count: true,
    })

    return this.schema
  }

  public static readonly Model =
    this.DataBaseService.interactionDB.models[this.name] ??
    this.DataBaseService.interactionDB.model(this.name, this.schemaFactory())
}
