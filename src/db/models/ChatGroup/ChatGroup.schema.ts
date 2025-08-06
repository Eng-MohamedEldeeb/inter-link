import { Schema, SchemaTypes } from 'mongoose'

import { IChatGroup } from '../../interfaces/IChatGroup.interface'
import { CloudUploader } from '../../../common/services/upload/cloud.service'

export const ChatGroupSchema = new Schema<IChatGroup>(
  {
    messages: {
      type: [
        {
          message: String,
          sentAt: String,
          from: { type: SchemaTypes.ObjectId, ref: 'User' },
          replyingTo: { type: SchemaTypes.ObjectId, ref: 'User' },
          likedBy: [{ type: SchemaTypes.ObjectId, ref: 'User' }],
          updatedAt: Date,
          deletedAt: Date,
        },
      ],
    },

    cover: {
      fullPath: String,
      folderId: String,
      path: {
        secure_url: {
          type: String,
          default:
            'https://res.cloudinary.com/djjqzi02l/image/upload/v1750848008/blank-profile-picture_d3zmwj.png',
        },
        public_id: String,
      },
    },

    name: {
      type: String,
      minlength: [
        2,
        "ChatGroup's name can't be less than 2 characters at least",
      ],
      maxlength: [50, "ChatGroup's name can't be more than 50 characters"],
      required: [true, "ChatGroup's name is required"],
      unique: [true, 'ChatGroup name must be unique'],
    },

    description: {
      type: String,
      maxlength: [
        700,
        "ChatGroup's description can't be more than 700 characters",
      ],
      required: [true, "ChatGroup's name is required"],
    },

    members: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

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

ChatGroupSchema.virtual('totalMembers').get(function (this: IChatGroup) {
  if (this.members) return this.members.length
  return 0
})

ChatGroupSchema.post('findOneAndDelete', async function (res: IChatGroup) {
  const { cover } = res

  if (cover.path) {
    await CloudUploader.deleteFolder({ fullPath: cover.fullPath })
  }
})
