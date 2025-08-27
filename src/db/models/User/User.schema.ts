import { Schema, SchemaTypes, UpdateQuery } from 'mongoose'

import { IUser } from '../../interfaces/IUser.interface'
import { hashValue } from '../../../common/utils/security/bcrypt/bcrypt.service'
import { OtpType } from '../enums/otp.enum'
import { encryptValue } from '../../../common/utils/security/crypto/crypto.service'
import { CloudUploader } from '../../../common/services/upload/cloud.service'

import postRepository from '../../../common/repositories/post.repository'
import communityRepository from '../../../common/repositories/community.repository'
import commentRepository from '../../../common/repositories/comment.repository'
import otpRepository from '../../../common/repositories/otp.repository'

export const UserSchema = new Schema<IUser>(
  {
    avatar: {
      secure_url: {
        type: String,
        default:
          'https://res.cloudinary.com/djjqzi02l/image/upload/v1750848008/blank-profile-picture_d3zmwj.png',
      },
      public_id: String,
    },

    bio: {
      type: String,
      maxlength: [700, 'bio limit is reached [700 char only allowed]'],
    },

    username: {
      type: String,
      required: [true, 'username is required'],
      unique: [true, 'username must be unique'],
      minlength: [2, "username can't be less than 2 then characters"],
      maxlength: [16, "username can't be more than 16 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'email is required'],
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: [true, 'phone number is required'],
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'password is required'],
      trim: true,
    },

    tempEmail: {
      type: String,
    },

    changedCredentialsAt: {
      type: Date,
    },

    oldPasswords: [String],

    following: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    followers: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    requests: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    blockedUsers: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    savedPosts: [{ type: SchemaTypes.ObjectId, ref: 'Post' }],

    likedPosts: [{ type: SchemaTypes.ObjectId, ref: 'Post' }],

    joinedCommunities: [{ type: SchemaTypes.ObjectId, ref: 'Community' }],

    viewers: [
      {
        viewer: {
          type: SchemaTypes.ObjectId,
          ref: 'User',
        },
        totalVisits: Number,
      },
    ],

    age: {
      type: Number,
      required: [true, 'birthDate is required'],
      min: 15,
    },

    isPrivateProfile: { type: Boolean, default: false },

    deactivatedAt: { type: Date, expires: '30d' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'createdBy',
  options: {
    lean: true,
    projection: {
      'attachments.paths.secure_url': 1,
    },
  },
})

UserSchema.virtual('totalPosts').get(function () {
  if (this.posts) return this.posts.length
  return 0
})

UserSchema.virtual('totalFollowing').get(function () {
  if (this.following) return this.following.length
  return 0
})

UserSchema.virtual('totalFollowers').get(function () {
  if (this.followers) return this.followers.length
  return 0
})

UserSchema.virtual('birthDate').set(function (v) {
  return this.set('age', new Date().getFullYear() - new Date(v).getFullYear())
})

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) this.password = hashValue(this.password)
  if (this.isModified('phone')) this.phone = encryptValue(this.phone!)

  return next()
})

UserSchema.post('save', async function (res) {
  const userDoc: Pick<IUser, 'email'> = res
  await otpRepository.findOneAndDelete({
    filter: {
      email: userDoc.email,
      type: OtpType.confirmRegistration,
    },
  })
})

UserSchema.pre('findOneAndUpdate', async function (next) {
  const updatedData: UpdateQuery<IUser> | null = this.getUpdate()
  const keys = Object.keys(updatedData ?? {}) as (keyof IUser)[]

  if (updatedData) {
    if (keys.includes('password'))
      this.setUpdate({
        password: hashValue(updatedData.password),
        $set: {
          changedCredentialsAt: Date.now(),
        },
      })

    if (keys.includes('phone'))
      this.setUpdate({
        phone: encryptValue(updatedData.phone),
      })
  }

  return next()
})

UserSchema.post('findOneAndDelete', async function ({ _id, avatar }: IUser) {
  Promise.allSettled([
    postRepository.deleteMany({ createdBy: _id }),
    commentRepository.deleteMany({ createdBy: _id }),
    communityRepository.deleteMany({ createdBy: _id }),
    avatar.secure_url != process.env.DEFAULT_PIC &&
      (await CloudUploader.deleteFolder({ fullPath: _id.toString() })),
  ])
})
