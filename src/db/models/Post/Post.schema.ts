import { Schema, SchemaTypes, UpdateQuery } from 'mongoose'
import { IPost } from '../interfaces/IPost.interface'

export const PostSchema = new Schema<IPost>(
  {
    // attachments: {type: [{String}]}

    title: {
      type: String,
      minlength: [2, "post title can't be less than 2 characters at least"],
      maxlength: [25, "post title can't be more than 25 characters"],
      required: [true, "post's title is required"],
    },

    content: {
      type: String,
      maxlength: [100, "post's content can't be more than 100 characters"],
    },

    likedBy: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    saves: { type: Number },

    shares: { type: Number },

    onGroup: { type: SchemaTypes.ObjectId, ref: 'Group' },

    createdBy: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'createdBy is required'],
    },
  },
  { timestamps: true },
)

PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'onPost',
})

PostSchema.virtual('likesCount').get(function () {
  return this.likedBy.length
})

PostSchema.virtual('commentsCount').get(function () {
  return this.comments.length
})

// PostSchema.post('findOneAndDelete', async function (res: IPost, next) {
//   Promise.allSettled([
//     posteRepository.deleteMany({ createdBy: res._id }),

//     PostRepository.deleteMany({ createdBy: res._id }),
//   ])
// })
