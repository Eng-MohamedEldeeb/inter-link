import { Schema, SchemaTypes } from 'mongoose'
import { IStory } from '../interfaces/IStory.interface'

export const StorySchema = new Schema<IStory>(
  {
    content: String,

    attachment: {
      folderId: String,
      path: {
        type: {
          secure_url: String,
          public_id: String,
        },
      },
    },
    viewers: { type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
)

StorySchema.index(
  { createdAt: 1 },
  {
    expires: '24h',
  },
)

StorySchema.virtual('totalViewers').get(function () {
  return this.viewers.length
})
