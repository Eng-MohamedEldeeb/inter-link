import { Types } from 'mongoose'
import { IMongoDoc } from '../../interface/mongo-doc.interface'
import { ICloud } from '../../../http/common/services/upload/interface/cloud-response.interface'

export interface IUserInputs {
  avatar: ICloud

  fullName: string
  username: string

  email: string
  password: string
  confirmPassword: string

  birthDate: Date
  phone: string

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
  totalFollowing: number

  followers: Types.ObjectId[]
  totalFollowers: number

  joinedGroups: Types.ObjectId[]

  blockList: Types.ObjectId[]

  deactivatedAt: Date
}
