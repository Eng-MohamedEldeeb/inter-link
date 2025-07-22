import { Response } from 'express'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { UserService } from '../user.service'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'

import {
  IAcceptFollowRequest,
  IBlockUser,
  IFollowUser,
  IRejectFollowRequest,
  IUnBlockUser,
  IUnFollowUser,
} from '../dto/user.dto'

import notificationsService from '../../../common/services/notifications/notification.service'
import { IFollowedUserNotification } from '../../../db/interface/INotification.interface'

export class UserController {
  private static readonly UserService = UserService
  private static readonly notificationsService = notificationsService

  static readonly getUserProfile = asyncHandler(
    async (req: IRequest, res: Response) => {
      const user = req.user
      const { _id: profileId } = req.profile

      if (user._id.equals(profileId)) return res.redirect('/api/v1/profile')

      return successResponse(res, {
        data: await this.UserService.getUserProfile({ user, profileId }),
      })
    },
  )

  static readonly getUserFollowers = asyncHandler(
    async (req: IRequest, res: Response) => {
      const user = req.user
      const profile = req.profile
      if (user._id.equals(profile._id))
        return res.redirect('/api/v1/profile/followers')
      return successResponse(res, {
        data: await this.UserService.getUseFollowers(user),
      })
    },
  )

  static readonly getUserFollowing = asyncHandler(
    async (req: IRequest, res: Response) => {
      const user = req.user
      const profile = req.profile
      if (user._id.equals(profile._id))
        return res.redirect('/api/v1/profile/following')
      return successResponse(res, {
        data: await this.UserService.getUseFollowing(user),
      })
    },
  )

  static readonly block = asyncHandler(
    async (req: IRequest<IBlockUser>, res: Response) => {
      const { id } = req.params
      const { _id: profileId } = req.profile
      await this.UserService.blockUser(profileId, id)
      return successResponse(res, {
        msg: 'user has been blocked successfully',
      })
    },
  )

  static readonly unblock = asyncHandler(
    async (req: IRequest<IUnBlockUser>, res: Response) => {
      const { _id: userId } = req.user
      const { _id: profileId, blockedUsers } = req.profile
      await this.UserService.unblockUser({ userId, profileId, blockedUsers })
      return successResponse(res, {
        msg: 'user has been un-blocked successfully',
      })
    },
  )

  static readonly follow = asyncHandler(
    async (req: IRequest<IFollowUser>, res: Response) => {
      const { _id: userId, isPrivateProfile } = req.user
      const { _id: profileId, avatar, fullName, username } = req.profile

      await this.UserService.follow({
        userId,
        userProfileState: isPrivateProfile,
        profileId,
      })
      const notification: IFollowedUserNotification = {
        title: `${username} Requested To Follow You!`,
        from: { _id: profileId, avatar, fullName, username },
        refTo: 'User',
      }

      await this.notificationsService.sendNotification({
        to: userId,
        notification,
      })

      return successResponse(res, {
        msg: 'followed successfully',
      })
    },
  )

  static readonly acceptFollowRequest = asyncHandler(
    async (req: IRequest<IAcceptFollowRequest>, res: Response) => {
      const { _id: profileId, avatar, username, fullName } = req.profile
      const { _id: userId } = req.user

      await this.UserService.acceptFollowRequest({
        user: req.user,
        profile: req.profile,
      })

      const notification: IFollowedUserNotification = {
        title: `${username} Accepted Your Follow Request`,
        from: { _id: profileId, username, fullName, avatar },
        refTo: 'User',
      }
      await this.notificationsService.sendNotification({
        to: userId,
        notification,
      })

      return successResponse(res, {
        msg: 'Follow request has been accepted successfully',
      })
    },
  )

  static readonly unfollow = asyncHandler(
    async (req: IRequest<IUnFollowUser>, res: Response) => {
      const { _id: userId } = req.user
      const { _id: profileId } = req.profile

      await this.UserService.unfollow({
        userId,
        profileId,
      })

      return successResponse(res, {
        msg: 'un-followed successfully',
      })
    },
  )

  static readonly rejectFollowRequest = asyncHandler(
    async (req: IRequest<IRejectFollowRequest>, res: Response) => {
      const user = req.user
      const profile = req.profile

      await this.UserService.rejectFollowRequest({
        user,
        profile,
      })

      return successResponse(res, {
        msg: 'Follow request has been rejected successfully',
      })
    },
  )
}
