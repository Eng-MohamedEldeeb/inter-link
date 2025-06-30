import { Types } from 'mongoose'
import userRepository from '../../../common/repositories/user.repository'
import { IUser } from '../../../db/models/interfaces/IUser.interface'
import { throwHttpError } from '../../../common/handlers/http/error-message.handler'

export class UserService {
  private static readonly userRepository = userRepository

  static readonly getUserProfile = async (
    user: Omit<IUser, 'password' | 'oldPasswords'>,
  ) => {
    const { isPrivateProfile, ...rest } = user

    if (isPrivateProfile)
      return {
        _id: user._id,
        avatar: user.avatar,
        fullName: user.fullName,
        totalPosts: user.totalPosts ?? 0,
        totalFollowers: user.totalFollowers ?? 0,
        totalFollowing: user.totalFollowing ?? 0,
        isPrivateProfile,
        __v: user.__v,
      }

    return { ...rest, isPrivateProfile }
  }

  static readonly getUseFollowers = async (
    user: Omit<IUser, 'password' | 'oldPasswords'>,
  ) => {
    const { isPrivateProfile, followers } = user

    if (isPrivateProfile)
      return throwHttpError({
        msg: "only user's followings can see his own followers",
        status: 403,
      })

    return {
      followers,
    }
  }

  static readonly getUseFollowing = async (
    user: Omit<IUser, 'password' | 'oldPasswords'>,
  ) => {
    const { isPrivateProfile, following } = user

    if (isPrivateProfile)
      return throwHttpError({
        msg: "only user's followings can see his own following",
        status: 403,
      })

    return {
      following,
    }
  }
  static readonly blockUser = async (
    profileId: Types.ObjectId,
    userId: Types.ObjectId,
  ) => {
    await this.userRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: profileId }, { deactivatedAt: { $exists: false } }],
      },
      data: {
        $addToSet: {
          blockList: userId,
        },
      },
      options: { lean: true, new: true },
    })
  }

  static readonly unblockUser = async (
    profileId: Types.ObjectId,
    userId: Types.ObjectId,
    profileBlockList: Types.ObjectId[],
  ) => {
    const isBlocked = profileBlockList.some(id => id.equals(userId))

    if (!isBlocked)
      return throwHttpError({ msg: 'user is already un-blocked', status: 400 })

    await this.userRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: profileId }, { deactivatedAt: { $exists: false } }],
      },
      data: {
        $pull: {
          blockList: userId,
        },
      },
      options: { lean: true, new: true },
    })
  }
}
