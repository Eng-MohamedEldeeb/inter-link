import { Schema, SchemaTypes } from 'mongoose'

import { IGroup } from '../../interfaces/IGroup.interface'
import { CloudUploader } from '../../../common/services/upload/cloud.service'

export const GroupSchema = new Schema<IGroup>(
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

    groupName: {
      type: String,
      minlength: [2, "Group's name can't be less than 2 characters at least"],
      maxlength: [50, "Group's name can't be more than 50 characters"],
      required: [true, "Group's name is required"],
      unique: [true, 'Group name must be unique'],
    },

    description: {
      type: String,
      maxlength: [700, "Group's description can't be more than 700 characters"],
      required: [true, "Group's name is required"],
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

GroupSchema.virtual('totalMembers').get(function (this: IGroup) {
  if (this.members) return this.members.length
  return 0
})

GroupSchema.post('findOneAndDelete', async function (res: IGroup) {
  const { cover } = res

  if (cover.path) {
    await CloudUploader.deleteFolder({ fullPath: cover.fullPath })
  }
})
