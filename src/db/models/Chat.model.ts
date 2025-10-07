import { Schema, SchemaTypes } from "mongoose"
import { ChatType, IChat } from "../interfaces/IChat.interface"
import { DataBaseService } from "../db.service"
import { IMessage, MessageStatus } from "../interfaces/IMessage.interface"
import { User } from "./User.model"
import { Message } from "./Message.model"
import { IUser } from "../interfaces/IUser.interface"

export class Chat {
  private static readonly DataBaseService = DataBaseService

  private static readonly schema = new Schema<IChat>(
    {
      startedBy: {
        type: SchemaTypes.ObjectId,
        ref: User.Model,
        required: [true, "startedBy id is required"],
      },

      participants: [
        {
          type: SchemaTypes.ObjectId,
          ref: User.Model,
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
    this.schema.virtual("messages", {
      localField: "_id",
      foreignField: "chatId",
      ref: Message.Model,
      options: {
        sort: { sentAt: 1 },
        projection: <Record<keyof IMessage, number>>{
          message: 1,
          sentAt: 1,
          status: 1,
          sender: 1,
          receiver: 1,
        },
        populate: [
          {
            path: "sender",
            foreignField: "_id",
            model: User.Model,
            select: <Record<keyof IUser, number>>{
              username: 1,
            },
          },
          {
            path: "receiver",
            foreignField: "_id",
            model: User.Model,
            select: <Record<keyof IUser, number>>{
              username: 1,
            },
          },
        ],
      },
      limit: 10,
    })

    this.schema.virtual("lastMessage", {
      localField: "_id",
      foreignField: "chatId",
      ref: Message.Model,
      options: {
        sort: { sentAt: -1 },
        populate: [
          {
            path: "sender",
            foreignField: "_id",
            model: User.Model,
            select: <Record<keyof IUser, number>>{
              username: 1,
            },
          },
        ],
        projection: {
          sender: 1,
          message: 1,
          sentAt: 1,
          status: 1,
        },
      },
      justOne: true,
    })

    this.schema.virtual("newMessages", {
      localField: "_id",
      foreignField: "chatId",
      ref: Message.Model,
      options: {
        sort: { sentAt: -1 },
        projection: { message: 1, sentAt: 1, status: 1 },
        populate: [
          {
            path: "sender",
            foreignField: "_id",
            model: User.Model,
            select: <Record<keyof IUser, number>>{
              username: 1,
            },
          },
        ],
        match: {
          $or: [
            { status: MessageStatus.sent },
            { status: MessageStatus.received },
          ],
        },
      },
    })

    this.schema.virtual("totalNewMessages").get(function (this: IChat) {
      return this.newMessages?.length ?? 0
    })

    return this.schema
  }

  public static readonly Model =
    this.DataBaseService.interactionDB.models[this.name] ??
    this.DataBaseService.interactionDB.model(this.name, this.schemaFactory())
}
