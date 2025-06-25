import { Types } from 'mongoose'
import userRepository from '../../../common/repositories/user.repository'
import { throwHttpError } from '../../common/utils/handlers/error-message.handler'
import { IUser } from '../../../db/models/interfaces/IUser.interface'

export class UserService {
  private static readonly userRepository = userRepository

  static readonly getUserProfile = async (
    user: Omit<IUser, 'password' | 'oldPasswords'>,
  ): Promise<Partial<IUser>> => {
    const { isPrivateProfile, ...rest } = user

    if (isPrivateProfile)
      return {
        _id: user._id,
        avatar: user.avatar,
        fullName: user.fullName,
        totalPosts: user.totalPosts,
        totalFollowers: user.totalFollowers,
        totalFollowing: user.totalFollowing,
        isPrivateProfile,
        __v: user.__v,
      }

    return { ...rest, isPrivateProfile }
  }

  static readonly blockUser = async (_id: Types.ObjectId) => {}

  static readonly unblockUser = async (_id: Types.ObjectId) => {}
}
