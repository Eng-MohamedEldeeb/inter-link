import userRepository from '../../common/repositories/user.repository'
import notificationsService from '../../common/services/notifications/notifications.service'

import { IUser } from '../../db/interfaces/IUser.interface'
import { throwError } from '../../common/handlers/error-message.handler'
import { MongoId } from '../../common/types/db'
import { UserViewersStrategy } from './helpers/user-viewers.strategy'
import { IFollowedUserNotification } from '../../db/interfaces/INotification.interface'

export class UserService {
  protected static readonly userRepository = userRepository
  protected static readonly notificationsService = notificationsService

  protected static readonly UserViewersStrategy = UserViewersStrategy
  protected static views: { viewer: MongoId; totalVisits: number }[]

  protected static userId: MongoId
  protected static profileId: MongoId

  protected static readonly updateUserViewers = async () => {
    const inViews = this.views.some(views =>
      views.viewer.equals(this.profileId),
    )
    if (inViews)
      return await this.UserViewersStrategy.incUserProfileViewersCount({
        userId: this.userId,
        profileId: this.profileId,
      })

    return await this.UserViewersStrategy.addViewerToProfile({
      userId: this.userId,
      profileId: this.profileId,
    })
  }

  public static readonly getUserProfile = async ({
    profileId,
    user,
  }: {
    profileId: MongoId
    user: Omit<IUser, 'password' | 'oldPasswords'>
  }) => {
    this.profileId = profileId
    this.userId = user._id
    console.log({ user })

    if (user.isPrivateProfile && user.viewers) {
      this.views = user.viewers
      console.log({ user })

      return await this.updateUserViewers()
    }

    return user
  }

  public static readonly getUseFollowers = async (
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

  public static readonly getUseFollowing = async (
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

  public static readonly blockUser = async (
    profileId: MongoId,
    userId: MongoId,
  ) => {
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

  public static readonly unblockUser = async ({
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

  public static readonly follow = async ({
    user,
    profile,
  }: {
    user: IUser
    profile: IUser
  }) => {
    const { _id: userId, isPrivateProfile, requests } = user
    const { _id: profileId, avatar, fullName, username, following } = profile

    const alreadyFollowed = following.some(userId => userId.equals(userId))
    const alreadyRequested = requests.some(userId => userId.equals(profileId))

    if (alreadyFollowed) return { msg: 'User is Followed Successfully' }
    if (alreadyRequested) return { msg: 'Follow Request sent Successfully' }

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

      await this.notificationsService.sendNotification({
        toUser: userId,
        notificationDetails: notification,
      })

      return { msg: 'Follow Request sent Successfully' }
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

    return { msg: 'User is Followed Successfully' }
  }

  public static readonly acceptFollowRequest = async ({
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

  public static readonly unfollow = async ({
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

  public static readonly rejectFollowRequest = async ({
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
