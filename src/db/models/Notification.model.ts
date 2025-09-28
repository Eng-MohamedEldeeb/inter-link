import { Schema, SchemaTypes } from "mongoose"

import {
  INotification,
  InteractionType,
  NotificationStatus,
} from "../interfaces/INotification.interface"

import { DataBaseService } from "../db.service"
import { User } from "./User.model"
import { Post } from "./Post.model"
import { Story } from "./Story.model"
import { Comment } from "./Comment.model"
import { Chat } from "./Chat.model"
import { Community } from "./Community.model"
import { Message } from "./Message.model"

export class Notification {
  private static readonly DataBaseService = DataBaseService

  private static readonly schema = new Schema<INotification>(
    {
      receiver: {
        type: SchemaTypes.ObjectId,
        ref: User.Model,
        required: [true, "receiver Id is required"],
      },

      sender: {
        type: SchemaTypes.ObjectId,
        ref: User.Model,
        required: [true, "sender Id is required"],
      },

      likedBy: [
        {
          type: SchemaTypes.ObjectId,
          ref: User.Model,
          required: [true, "Sender Id is required"],
        },
      ],

      onPost: { type: SchemaTypes.ObjectId, ref: Post.Model },

      onComment: { type: SchemaTypes.ObjectId, ref: Comment.Model },

      followedBy: { type: SchemaTypes.ObjectId, ref: User.Model },

      repliedWith: { type: SchemaTypes.ObjectId, ref: Comment.Model },

      interactionType: {
        type: String,
        enum: InteractionType,
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
      deletedAt: Date,
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
