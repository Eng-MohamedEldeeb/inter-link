import { Schema, SchemaTypes } from "mongoose"

import { IComment } from "../../interfaces/IComment.interface"
import { CloudUploader } from "../../../common/services/upload/cloud.service"

import commentRepository from "../../../common/repositories/concrete/comment.repository"

export const CommentSchema = new Schema<IComment>(
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

CommentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "replyingTo",
})

CommentSchema.virtual("totalLikes").get(function () {
  return this.likedBy?.length ?? 0
})

CommentSchema.virtual("repliesCount").get(function () {
  if (!this.replyingTo) return this.replies?.length ?? 0
  return
})

CommentSchema.post("findOneAndDelete", async function (res: IComment) {
  const { attachment } = res

  if (attachment?.path.public_id) {
    await CloudUploader.deleteFolder({ fullPath: attachment.fullPath })
  }

  await commentRepository.deleteMany({ replyingTo: res._id })
})
