import { IMongoDoc } from './IMongo-doc.interface'
import { ICloud } from '../../common/services/upload/interface/cloud-response.interface'
import { MongoObjId } from '../../common/types/db/mongo.types'

export interface IUserInputs {
  fullName: string
  username: string

  email: string
  password: string
  confirmPassword: string

  birthDate?: Date
  phone?: string

  otpCode: string

  bio?: string
  isPrivateProfile?: boolean
}

export interface IUser
  extends IMongoDoc,
    Omit<IUserInputs, 'confirmPassword' | 'otpCode'> {
  avatar: ICloud

  age: number

  tempEmail?: string
  changedCredentialsAt?: Date
  oldPasswords: string[]

  posts: MongoObjId[]
  totalPosts: number

  savedPosts: MongoObjId[]
  likedPosts: MongoObjId[]

  following: MongoObjId[]
  totalFollowing: number

  followers: MongoObjId[]
  totalFollowers: number

  viewers: {
    viewer: MongoObjId
    totalVisits: number
  }[]

  joinedGroups: MongoObjId[]

  blockedUsers: MongoObjId[]

  deactivatedAt?: Date
}
