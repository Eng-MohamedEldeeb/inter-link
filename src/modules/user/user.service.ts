import userRepository from '../../common/repositories/user.repository'

import { IUser } from '../../db/interface/IUser.interface'
import { throwError } from '../../common/handlers/error-message.handler'
import { MongoId } from '../../common/types/db/db.types'
import { UserViewersStrategy } from './helpers/user-viewers.strategy'
import { IFollowedUserNotification } from '../../db/interface/INotification.interface'

import notificationsService from '../../common/services/notifications/notifications.service'

export class UserService {
  private static readonly userRepository = userRepository
  private static readonly UserViewersStrategy = UserViewersStrategy
  private static readonly notificationsService = notificationsService

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

  static readonly unblockUser = async ({
    userId,
    profileId,
    blockedUsers,
  }: {
    profileId: MongoId
    userId: MongoId
    blockedUsers: MongoId[]
  }) => {
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

  static readonly follow = async ({
    user,
    profile,
  }: {
    user: IUser
    profile: IUser
  }) => {
    const { _id: userId, isPrivateProfile } = user
    const { _id: profileId, avatar, fullName, username } = profile

    if (isPrivateProfile) {
      await this.userRepository.findByIdAndUpdate({
        _id: userId,
        data: { $addToSet: { requests: profileId } },
      })

      const notification: IFollowedUserNotification = {
        title: `${username} Requested To Follow You 💛`,
        from: { _id: profileId, avatar, fullName, username },
        refTo: 'User',
      }

      return await this.notificationsService.sendNotification({
        toUser: userId,
        notificationDetails: notification,
      })
    }

    await this.userRepository.findByIdAndUpdate({
      _id: userId,
      data: { $addToSet: { followers: profileId } },
    })

    await this.userRepository.findByIdAndUpdate({
      _id: profileId,
      data: { $addToSet: { following: userId } },
    })

    const notification: IFollowedUserNotification = {
      title: `${username} Started Following You 💚`,
      from: { _id: profileId, avatar, fullName, username },
      refTo: 'User',
    }

    await this.notificationsService.sendNotification({
      toUser: userId,
      notificationDetails: notification,
    })
  }

  static readonly acceptFollowRequest = async ({
    profile,
    user,
  }: {
    profile: IUser
    user: IUser
  }) => {
    const {
      _id: profileId,
      isPrivateProfile,
      requests,
      avatar,
      username,
      fullName,
    } = profile
    const { _id: userId } = user

    const inRequests = requests.some(id => id.equals(userId))

    if (!inRequests)
      return throwError({ msg: 'Follow Request Not Found', status: 404 })

    await this.userRepository.findOneAndUpdate({
      filter: {
        $and: [
          { $and: [{ _id: profileId }, { isPrivateProfile }] },
          { deactivatedAt: { $exists: false } },
        ],
      },
      data: { $addToSet: { followers: userId }, $pull: { requests: userId } },
    })

    await this.userRepository.findByIdAndUpdate({
      _id: userId,
      data: { $addToSet: { following: profileId } },
    })

    const notification: IFollowedUserNotification = {
      title: `${username} Accepted Your Follow Request 🩵`,
      from: { _id: profileId, username, fullName, avatar },
      refTo: 'User',
    }

    await this.notificationsService.sendNotification({
      toUser: userId,
      notificationDetails: notification,
    })
  }

  static readonly unfollow = async ({
    userId,
    profileId,
  }: {
    userId: MongoId
    profileId: MongoId
  }) => {
    await this.userRepository.findByIdAndUpdate({
      _id: userId,
      data: { $pull: { followers: profileId } },
    })

    await this.userRepository.findByIdAndUpdate({
      _id: profileId,
      data: { $pull: { following: userId } },
    })
  }

  static readonly rejectFollowRequest = async ({
    user,
    profile,
  }: {
    user: Pick<IUser, 'isPrivateProfile' | '_id'>
    profile: Pick<IUser, '_id'>
  }) => {
    const { _id: profileId } = profile
    const { _id: userId, isPrivateProfile } = user

    await this.userRepository.findOneAndUpdate({
      filter: {
        $and: [
          { _id: profileId },
          { isPrivateProfile },
          { deactivatedAt: { $exists: false } },
        ],
      },
      data: { $pull: { requests: userId } },
    })
  }
}
