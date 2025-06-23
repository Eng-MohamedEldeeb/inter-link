import { Types } from 'mongoose'
import { IMongoDoc } from '../../interface/mongo-doc.interface'

export interface IUserInputs {
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

  following: Types.ObjectId[]
  followers: Types.ObjectId[]

  groups: Types.ObjectId[]

  blockList: Types.ObjectId[]
}
