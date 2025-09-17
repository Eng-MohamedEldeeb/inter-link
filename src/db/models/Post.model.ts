import { Schema, SchemaTypes } from "mongoose"

import { IPost } from "../interfaces/IPost.interface"
import { CloudUploader } from "../../common/services/upload/cloud.service"

import { commentRepository } from "../repositories"
import { DataBaseService } from "../db.service"

export class Post {
  private static readonly DataBaseService = DataBaseService

  private static readonly schema = new Schema<IPost>(
    {
      attachments: {
        fullPath: String,
        folderId: String,
        paths: [{ secure_url: String, public_id: String }],
      },

      title: {
        type: String,
        minlength: [2, "post title can't be less than 2 characters at least"],
        maxlength: [50, "post title can't be more than 50 characters"],
        required: [true, "post's title is required"],
      },

      content: {
        type: String,
        maxlength: [100, "post's content can't be more than 100 characters"],
      },

      likedBy: [{ type: SchemaTypes.ObjectId, ref: "User" }],

      totalSaves: { type: Number },

      shares: { type: Number },

      onCommunity: { type: SchemaTypes.ObjectId, ref: "Community" },

      archivedAt: { type: Date },

      createdBy: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: [true, "createdBy is required"],
      },
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    },
  )

  private static readonly schemaFactory = () => {
    this.schema.index({ archivedAt: 1 }, { expires: "15d" })

    this.schema.virtual("comments", {
      ref: "Comment",
      localField: "_id",
      foreignField: "onPost",
      options: { sort: { createdAt: -1 } },
    })

    this.schema.virtual("totalLikes").get(function () {
      return this.likedBy?.length ?? 0
    })

    this.schema.virtual("totalComments").get(function () {
      return this.comments?.length ?? 0
    })

    this.schema.post("findOneAndDelete", async function (res: IPost) {
      await commentRepository.deleteMany({ onPost: res._id })

      const attachments = res.attachments

      if (attachments.paths.length) {
        await CloudUploader.deleteFolder({ fullPath: attachments.fullPath })
      }
    })

    return this.schema
  }

  public static readonly Model =
    this.DataBaseService.generalDB.models[this.name] ??
    this.DataBaseService.generalDB.model(this.name, this.schemaFactory())
}
