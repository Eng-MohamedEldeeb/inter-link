import userRepository from '../../common/repositories/user.repository'
import { IUser } from '../../db/interface/IUser.interface'
import { throwError } from '../../common/handlers/error-message.handler'
import { MongoObjId } from '../../common/types/db/mongo.types'

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
        totalPosts: user.posts.length ?? 0,
        totalFollowers: user.followers.length ?? 0,
        totalFollowing: user.following.length ?? 0,
        isPrivateProfile,
      }

    return { ...rest, isPrivateProfile }
  }

  static readonly getUseFollowers = async (
    user: Omit<IUser, 'password' | 'oldPasswords'>,
  ) => {
    const { isPrivateProfile, followers } = user

    if (isPrivateProfile)
      return throwError({
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
      return throwError({
        msg: "only user's followings can see his own following",
        status: 403,
      })

    return {
      following,
    }
  }
  static readonly blockUser = async (
    profileId: MongoObjId,
    userId: MongoObjId,
  ) => {
    await this.userRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: profileId }, { deactivatedAt: { $exists: false } }],
      },
      data: {
        $addToSet: {
          blockedUsers: userId,
        },
      },
      options: { lean: true, new: true },
    })
  }

  static readonly unblockUser = async (
    profileId: MongoObjId,
    userId: MongoObjId,
    blockedUsers: MongoObjId[],
  ) => {
    const isBlocked = blockedUsers.some(id => id.equals(userId))

    if (!isBlocked)
      return throwError({ msg: 'user is already un-blocked', status: 400 })

    await this.userRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: profileId }, { deactivatedAt: { $exists: false } }],
      },
      data: {
        $pull: {
          blockedUsers: userId,
        },
      },
      options: { lean: true, new: true },
    })
  }
}
