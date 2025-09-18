import { Schema, SchemaTypes } from "mongoose"

import {
  INotification,
  NotificationRefTo,
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

  private static modelsReference = {
    User: User.Model,
    Post: Post.Model,
    Story: Story.Model,
    Comment: Comment.Model,
    Chat: Chat.Model,
  }

  private static readonly schema = new Schema<INotification>(
    {
      message: {
        type: String,
        required: [true, "notification message is required"],
      },

      sender: {
        type: SchemaTypes.ObjectId,
        ref: User.Model,
        required: [true, "Sender Id is required"],
      },

      receiver: {
        type: SchemaTypes.ObjectId,
        ref: User.Model,
        required: [true, "receiver Id is required"],
      },

      relatedTo: {
        type: SchemaTypes.ObjectId,
        required: [true, "notification relatedTo id is required"],
        ref(this: INotification) {
          switch (this.refTo) {
            case NotificationRefTo.Post:
              return Post.Model

            case NotificationRefTo.Story:
              return Story.Model

            case NotificationRefTo.Comment:
              return Comment.Model

            case NotificationRefTo.Community:
              return Community.Model

            case NotificationRefTo.Chat:
              return Chat.Model

            case NotificationRefTo.Message:
              return Message.Model

            default:
              return User.Model
          }
        },
      },

      refTo: {
        type: String,
        enum: NotificationRefTo,
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
