import { Schema, SchemaTypes } from 'mongoose'

import { IGroup } from '../../interface/IGroup.interface'

import postRepository from '../../../common/repositories/post.repository'
import slugify from 'slugify'
import { CloudUploader } from '../../../common/services/upload/cloud.service'

export const GroupSchema = new Schema<IGroup>(
  {
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
      minlength: [2, "group's name can't be less than 2 characters at least"],
      maxlength: [50, "group's name can't be more than 50 characters"],
      required: [true, "Group's name is required"],
      unique: [true, 'Group name must be unique'],
    },

    description: {
      type: String,
      maxlength: [700, "group's description can't be more than 700 characters"],
      required: [true, "Group's name is required"],
    },

    slug: {
      type: String,
      default: function () {
        return slugify(this.name).toLowerCase()
      },
    },

    admins: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    members: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    isPrivateGroup: { type: Boolean, default: false },

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

GroupSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'onGroup',
})

GroupSchema.virtual('totalMembers').get(function (this: IGroup) {
  if (this.members) return this.members.length
  return 0
})

GroupSchema.post('findOneAndDelete', async function (res: IGroup) {
  const { _id, cover } = res

  await postRepository.deleteMany({ onGroup: _id })

  if (cover.path) {
    await CloudUploader.deleteFolder({ fullPath: cover.fullPath })
  }
})
