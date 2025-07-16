import userRepository from '../../common/repositories/user.repository'

import { IUser } from '../../db/interface/IUser.interface'
import { throwError } from '../../common/handlers/error-message.handler'
import { MongoId } from '../../common/types/db/db.types'
import { UserViewersStrategy } from './helpers/user-viewers.strategy'

export class UserService {
  private static readonly userRepository = userRepository
  private static readonly UserViewersStrategy = UserViewersStrategy

  static readonly getUserProfile = async ({
    profileId,
    user,
  }: {
    profileId: MongoId
    user: Omit<IUser, 'password' | 'oldPasswords'>
  }) => {
    if (user.isPrivateProfile)
      return {
        _id: user._id,
        avatar: user.avatar,
        fullName: user.fullName,
        totalPosts: user.posts.length ?? 0,
        totalFollowers: user.followers.length ?? 0,
        totalFollowing: user.following.length ?? 0,
        isPrivateProfile: user.isPrivateProfile,
      }

    const isInViewersList = user.viewers.some(({ viewer }) =>
      viewer.equals(profileId),
    )

    if (isInViewersList)
      return await this.UserViewersStrategy.incUserProfileViewersCount({
        userId: user._id,
        profileId,
      })

    return await this.UserViewersStrategy.addViewerToProfile({
      userId: user._id,
      profileId,
    })
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
  static readonly blockUser = async (profileId: MongoId, userId: MongoId) => {
    await this.userRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: profileId }, { deactivatedAt: { $exists: false } }],
      },
      data: {
        $adSet: {
          blockedUsers: userId,
        },
      },
      options: { lean: true, new: true },
    })
  }

  static readonly unblockUser = async (
    profileId: MongoId,
    userId: MongoId,
    blockedUsers: MongoId[],
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
