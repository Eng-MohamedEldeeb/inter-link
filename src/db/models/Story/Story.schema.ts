import { Schema, SchemaTypes } from 'mongoose'
import { IStory } from '../../interface/IStory.interface'
import { CloudUploader } from '../../../common/services/upload/cloud.service'

export const StorySchema = new Schema<IStory>(
  {
    content: {
      type: String,
      required: function () {
        return this.attachment.folderId ? false : true
      },
    },

    attachment: {
      folderId: String,
      path: {
        type: {
          secure_url: String,
          public_id: String,
        },
      },
    },

    viewers: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    createdBy: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'story creator id is required'],
    },
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
  return this.viewers?.length ?? 0
})

StorySchema.post('findOneAndDelete', async function (res: IStory) {
  const { attachment } = res

  if (attachment?.path.public_id) {
    await CloudUploader.delete(attachment.path.public_id)
    await CloudUploader.deleteFolder(attachment.fullPath)
  }
})
