import { Schema, SchemaTypes } from 'mongoose'
import { IComment } from '../../interface/IComment.interface'

export const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      trim: true,
      minlength: [
        2,
        "comment's content can't be less than 2 characters at least",
      ],
      maxlength: [25, "comment's content can't be more than 25 characters"],
      required: [true, "Comment's content is required"],
    },
    onPost: { type: SchemaTypes.ObjectId, ref: 'Post' },

    createdBy: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'createdBy is required'],
    },

    likedBy: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    replyingTo: { type: SchemaTypes.ObjectId, ref: 'Comment' },
  },
  { timestamps: true },
)

CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'replyingTo',
})

CommentSchema.virtual('totalLikes').get(function () {
  return this.likedBy.length ?? 0
})

CommentSchema.virtual('repliesCount').get(function () {
  return this.replies.length ?? 0
})
// CommentSchema.post('findOneAndDelete', async function (res: IComment, next) {
//   Promise.allSettled([
//     posteRepository.deleteMany({ createdBy: res._id }),

//     CommentRepository.deleteMany({ createdBy: res._id }),
//   ])
// })
