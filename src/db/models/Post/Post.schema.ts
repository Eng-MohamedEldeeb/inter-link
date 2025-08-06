import { Schema, SchemaTypes } from 'mongoose'

import { IPost } from '../../interfaces/IPost.interface'
import { CloudUploader } from '../../../common/services/upload/cloud.service'

import commentRepository from '../../../common/repositories/comment.repository'

export const PostSchema = new Schema<IPost>(
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

    likedBy: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    totalSaves: { type: Number },

    shares: { type: Number },

    onCommunity: { type: SchemaTypes.ObjectId, ref: 'Community' },

    archivedAt: { type: Date },

    createdBy: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'createdBy is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

PostSchema.index({ archivedAt: 1 }, { expires: '15d' })

PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'onPost',
  options: { sort: { createdAt: -1 } },
})

PostSchema.virtual('totalLikes').get(function () {
  return this.likedBy?.length ?? 0
})

PostSchema.virtual('totalComments').get(function () {
  return this.comments?.length ?? 0
})

PostSchema.post('findOneAndDelete', async function (res: IPost) {
  await commentRepository.deleteMany({ onPost: res._id })

  const attachments = res.attachments

  if (attachments.paths.length) {
    await CloudUploader.deleteFolder({ fullPath: attachments.fullPath })
  }
})
