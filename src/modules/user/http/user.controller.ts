import { Response } from "express"
import { successResponse } from "../../../common/handlers/success-response.handler"
import { IRequest } from "../../../common/interface/IRequest.interface"
import { asyncHandler } from "../../../common/decorators/async-handler/async-handler.decorator"

import userService from "../user.service"

import {
  IAcceptFollowRequest,
  IBlockUser,
  IFollowUser,
  IRejectFollowRequest,
  IUnBlockUser,
  IUnFollowUser,
} from "../dto/user.dto"

class UserController {
  private readonly userService = userService

  public readonly getUserProfile = asyncHandler(
    async (req: IRequest, res: Response) => {
      const user = req.user
      const { _id: profileId } = req.profile

      if (user._id.equals(profileId)) return res.redirect("/api/v1/profile")

      return successResponse(res, {
        data: await this.userService.getUserProfile({ user, profileId }),
      })
    },
  )

  public readonly getUserFollowers = asyncHandler(
    async (req: IRequest, res: Response) => {
      const user = req.user
      const profile = req.profile
      if (user._id.equals(profile._id))
        return res.redirect("/api/v1/profile/followers")
      return successResponse(res, {
        data: await this.userService.getUseFollowers(user),
      })
    },
  )

  public readonly getUserFollowing = asyncHandler(
    async (req: IRequest, res: Response) => {
      const user = req.user
      const profile = req.profile
      if (user._id.equals(profile._id))
        return res.redirect("/api/v1/profile/following")
      return successResponse(res, {
        data: await this.userService.getUseFollowing(user),
      })
    },
  )

  public readonly block = asyncHandler(
    async (req: IRequest<IBlockUser>, res: Response) => {
      const { _id: userId, username } = req.user
      const { _id: profileId } = req.profile
      await this.userService.blockUser(profileId, userId)
      return successResponse(res, {
        msg: `Blocked ${username} successfully`,
      })
    },
  )

  public readonly unblock = asyncHandler(
    async (req: IRequest<IUnBlockUser>, res: Response) => {
      const { _id: userId, username } = req.user
      const { _id: profileId, blockedUsers } = req.profile
      await this.userService.unblockUser({ userId, profileId, blockedUsers })
      return successResponse(res, {
        msg: `Unblocked ${username} successfully`,
      })
    },
  )

  public readonly follow = asyncHandler(
    async (req: IRequest<IFollowUser>, res: Response) => {
      const { msg } = await this.userService.follow({
        user: req.user,
        profile: req.profile,
      })

      return successResponse(res, {
        msg,
      })
    },
  )

  public readonly acceptFollowRequest = asyncHandler(
    async (req: IRequest<IAcceptFollowRequest>, res: Response) => {
      await this.userService.acceptFollowRequest({
        user: req.user,
        profile: req.profile,
      })

      return successResponse(res, {
        msg: `Accepted ${req.user.username} Follow request Successfully`,
      })
    },
  )

  public readonly unfollow = asyncHandler(
    async (req: IRequest<IUnFollowUser>, res: Response) => {
      const { _id: userId, username } = req.user
      const { _id: profileId } = req.profile

      await this.userService.unfollow({
        userId,
        profileId,
      })

      return successResponse(res, {
        msg: `Unfollowed ${username} Successfully`,
      })
    },
  )

  public readonly rejectFollowRequest = asyncHandler(
    async (req: IRequest<IRejectFollowRequest>, res: Response) => {
      const user = req.user
      const profile = req.profile

      await this.userService.rejectFollowRequest({
        user,
        profile,
      })

      return successResponse(res, {
        msg: `Rejected ${req.user.username} Follow request Successfully`,
      })
    },
  )
}

export default new UserController()
