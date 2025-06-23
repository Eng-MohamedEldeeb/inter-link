import { Types } from 'mongoose'
import { IMongoDoc } from '../../interface/mongo-doc.interface'

export interface IUserInputs {
  avatar: Object

  fullName: string
  username: string

  email: string
  password: string
  confirmPassword: string

  birthDate: Date

  otpCode: string

  bio: string
  isPrivateProfile: boolean
}

export interface IUser
  extends IMongoDoc,
    Omit<IUserInputs, 'confirmPassword' | 'otpCode'> {
  age: number

  changedCredentialsAt: Date
  oldPasswords: string[]

  posts: Types.ObjectId[]
  postsCount: number

  savedPosts: Types.ObjectId[]
  likedPosts: Types.ObjectId[]

  following: Types.ObjectId[]
  followingCount: number

  followers: Types.ObjectId[]
  followersCount: number

  groups: Types.ObjectId[]

  blockList: Types.ObjectId[]
}
