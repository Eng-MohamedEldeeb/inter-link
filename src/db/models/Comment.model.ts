import { Schema, SchemaTypes } from "mongoose"

import { IComment } from "../interfaces/IComment.interface"
import { CloudUploader } from "../../common/services/upload/cloud.service"

import { commentRepository } from "../repositories"
import { DataBaseService } from "../db.service"

export class Comment {
  private static readonly DataBaseService = DataBaseService

  private static readonly schema = new Schema<IComment>(
    {
      attachment: {
        fullPath: String,
        folderId: String,
        path: { secure_url: String, public_id: String },
      },
      content: {
        type: String,
        trim: true,
        minlength: [
          2,
          "comment's content can't be less than 2 characters at least",
        ],
        maxlength: [500, "comment's content can't be more than 500 characters"],
        required: [true, "Comment's content is required"],
      },
      onPost: { type: SchemaTypes.ObjectId, ref: "Post" },

      createdBy: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: [true, "createdBy is required"],
      },

      likedBy: [{ type: SchemaTypes.ObjectId, ref: "User" }],

      replyingTo: { type: SchemaTypes.ObjectId, ref: "Comment" },
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    },
  )

  private static readonly schemaFactory = () => {
    this.schema.virtual("replies", {
      ref: "Comment",
      localField: "_id",
      foreignField: "replyingTo",
    })

    this.schema.virtual("totalLikes").get(function () {
      return this.likedBy?.length ?? 0
    })

    this.schema.virtual("repliesCount").get(function () {
      if (!this.replyingTo) return this.replies?.length ?? 0
      return
    })

    this.schema.post("findOneAndDelete", async function (res: IComment) {
      const { attachment } = res

      if (attachment?.path.public_id) {
        await CloudUploader.deleteFolder({ fullPath: attachment.fullPath })
      }

      await commentRepository.deleteMany({ replyingTo: res._id })
    })

    return this.schema
  }

  public static readonly Model =
    this.DataBaseService.generalDB.models[this.name] ??
    this.DataBaseService.generalDB.model(this.name, this.schemaFactory())
}
