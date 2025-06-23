import { Schema, SchemaTypes, UpdateQuery } from 'mongoose'
import { IUser } from '../interfaces/IUser.interface'
import { hashValue } from '../../../utils/security/bcrypt/bcrypt.service'
import otpRepository from '../../../common/repositories/otp.repository'
import { OtpType } from '../enums/otp.enum'

export const UserSchema = new Schema<IUser>(
  {
    // avatar: {type: {

    // }},

    fullName: {
      type: String,
      required: [true, 'fullName is required'],
      trim: true,
    },

    bio: {
      type: String,
      maxlength: [700, 'bio limit has been reached [700 char only allowed]'],
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

    password: {
      type: String,
      required: [true, 'password is required'],
      trim: true,
    },

    changedCredentialsAt: {
      type: Date,
    },

    oldPasswords: [String],

    following: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    followers: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    blockList: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    savedPosts: [{ type: SchemaTypes.ObjectId, ref: 'Post' }],

    likedPosts: [{ type: SchemaTypes.ObjectId, ref: 'Post' }],

    // groups: [{ type: SchemaTypes.ObjectId, ref: 'Group' }],

    age: {
      type: Number,
      required: [true, 'birthDate is required'],
      min: 15,
    },

    isPrivateProfile: { type: Boolean, default: false },
  },
  { timestamps: true },
)

UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'createdBy',
})

UserSchema.virtual('birthDate')
  .get(function (v) {
    return new Date().getFullYear() - new Date(v).getFullYear()
  })
  .set(function (v) {
    return this.set('age', new Date().getFullYear() - new Date(v).getFullYear())
  })

UserSchema.virtual('postsCount').get(function () {
  return this.posts.length
})

UserSchema.virtual('followingCount').get(function () {
  return this.following.length
})

UserSchema.virtual('followersCount').get(function () {
  return this.followers.length
})

UserSchema.virtual('birthDate')
  .get(function (v) {
    return new Date().getFullYear() - new Date(v).getFullYear()
  })
  .set(function (v) {
    return this.set('age', new Date().getFullYear() - new Date(v).getFullYear())
  })

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) this.password = hashValue(this.password)

  return next()
})

UserSchema.post('save', async function (res) {
  const userDoc: Pick<IUser, 'email'> = res
  await otpRepository.findOneAndDelete({
    filter: {
      email: userDoc.email,
      type: OtpType.confirm,
    },
  })
})

UserSchema.pre('findOneAndUpdate', function (next) {
  const updatedData: UpdateQuery<IUser> | null = this.getUpdate()
  const keys = Object.keys(updatedData ?? {}) as (keyof IUser)[]

  if (updatedData && keys.includes('password'))
    this.setUpdate({
      password: hashValue(updatedData.password),
      $set: {
        changedCredentialsAt: Date.now(),
      },
    })

  return next()
})

// UserSchema.post('findOneAndDelete', async function (res: IUser, next) {
//   Promise.allSettled([
//     posteRepository.deleteMany({ createdBy: res._id }),

//     groupRepository.deleteMany({ createdBy: res._id }),
//   ])
// })
