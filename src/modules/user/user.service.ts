import notifyService from "../../common/services/notify/notify.service"

import { currentMoment } from "../../common/decorators/moment/moment"
import { throwError } from "../../common/handlers/error-message.handler"
import { userRepository } from "../../common/repositories"
import { MongoId } from "../../common/types/db"
import { UserStatus } from "../../common/utils/notify/types"
import { IFollowedUserNotification } from "../../db/interfaces/INotification.interface"
import { IUser } from "../../db/interfaces/IUser.interface"
import { UserViewersStrategy } from "./helpers/user-viewers.strategy"

const usersStatus = new Map<string, UserStatus>()

class UserService {
  private readonly userRepository = userRepository
  private readonly notifyService = notifyService

  private readonly UserViewersStrategy = UserViewersStrategy
  private views!: { viewer: MongoId; totalVisits: number }[]

  private userId!: MongoId
  private profileId!: MongoId

  public readonly getUserProfile = async ({
    profileId,
    user,
  }: {
    profileId: MongoId
    user: Omit<IUser, "password" | "oldPasswords">
  }) => {
    this.profileId = profileId
    this.userId = user._id

    if (user.isPrivateProfile && user.viewers) {
      this.views = user.viewers

      return await this.updateUserViewers()
    }

    return user
  }

  private readonly updateUserViewers = async () => {
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

  public readonly getUseFollowers = async (
    user: Omit<IUser, "password" | "oldPasswords">,
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

  public readonly getUseFollowing = async (
    user: Omit<IUser, "password" | "oldPasswords">,
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

  public readonly blockUser = async (profileId: MongoId, userId: MongoId) => {
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

  public readonly unblockUser = async ({
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
      return throwError({ msg: "user is already un-blocked", status: 400 })

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

  public readonly follow = async ({
    user,
    profile,
  }: {
    user: IUser
    profile: IUser
  }) => {
    const alreadyFollowed = profile.following.some(userId =>
      userId.equals(user._id),
    )
    const alreadyRequested = user.requests.some(userId =>
      userId.equals(profile._id),
    )

    if (alreadyFollowed)
      return { msg: `Followed ${user.username} Successfully` }
    if (alreadyRequested)
      return { msg: `Follow Request Sent to ${user.username} Successfully` }

    if (user.isPrivateProfile) {
      await this.userRepository.findByIdAndUpdate({
        _id: user._id,
        data: { $addToSet: { requests: profile._id } },
      })

      const notification: IFollowedUserNotification = {
        message: `${profile.username} Requested To Follow You 💛`,
        from: {
          _id: profile._id,
          avatar: profile.avatar,
          username: profile.username,
        },
        refTo: "User",
        sentAt: currentMoment(),
      }

      this.notifyService.sendNotification({
        userId: user._id,
        notificationDetails: notification,
      })

      return { msg: "Follow Request sent Successfully" }
    }

    await this.userRepository.findByIdAndUpdate({
      _id: user._id,
      data: { $addToSet: { followers: profile._id } },
    })

    await this.userRepository.findByIdAndUpdate({
      _id: profile._id,
      data: { $addToSet: { following: user._id } },
    })

    const notification: IFollowedUserNotification = {
      message: `${user.username} Started Following You 💚`,
      from: {
        _id: profile._id,
        avatar: profile.avatar,
        username: profile.username,
      },
      refTo: "User",
      sentAt: currentMoment(),
    }

    this.notifyService.sendNotification({
      userId: user._id,
      notificationDetails: notification,
    })

    return { msg: "User is Followed Successfully" }
  }

  public readonly acceptFollowRequest = async ({
    profile,
    user,
  }: {
    profile: IUser
    user: IUser
  }) => {
    const inProfileRequests = profile.requests.some(userId =>
      userId.equals(user._id),
    )

    if (!inProfileRequests)
      return throwError({ msg: "Follow Request Not Found", status: 404 })

    await this.userRepository.findOneAndUpdate({
      filter: {
        $and: [
          {
            $and: [
              { _id: profile._id },
              { isPrivateProfile: profile.isPrivateProfile },
            ],
          },
          { deactivatedAt: { $exists: false } },
        ],
      },
      data: {
        $addToSet: { followers: user._id },
        $pull: { requests: user._id },
      },
    })

    await this.userRepository.findByIdAndUpdate({
      _id: user._id,
      data: { $addToSet: { following: profile._id } },
    })

    const notification: IFollowedUserNotification = {
      message: `${profile.username} Accepted Your Follow Request 🩵`,
      from: {
        _id: profile._id,
        username: profile.username,
        avatar: profile.avatar,
      },
      refTo: "User",
      sentAt: currentMoment(),
    }

    this.notifyService.sendNotification({
      userId: user._id,
      notificationDetails: notification,
    })
  }

  public readonly unfollow = async ({
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

  public readonly rejectFollowRequest = async ({
    user,
    profile,
  }: {
    user: Pick<IUser, "isPrivateProfile" | "_id">
    profile: Pick<IUser, "_id">
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

  public readonly getCurrentStatus = (profileId: MongoId): UserStatus => {
    const userStatus = usersStatus.get(profileId.toString())

    if (userStatus) return userStatus

    return { socketId: "", isConnected: false }
  }

  public readonly setOnline = ({
    profileId,
    socketId,
  }: {
    profileId: MongoId
    socketId: string
  }) => {
    usersStatus.set(profileId.toString(), {
      isConnected: true,
      socketId,
    })
  }

  public readonly setOffline = (profileId: MongoId) => {
    const userStatus = this.getCurrentStatus(profileId)

    if (!userStatus) return

    const { socketId } = userStatus

    usersStatus.set(profileId.toString(), {
      socketId,
      isConnected: false,
    })
  }
}

export default new UserService()
