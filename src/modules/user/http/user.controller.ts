import { Response } from 'express'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { IRequest } from '../../../common/interface/http/IRequest.interface'
import { IBlockUserDTO, IUnBlockUserDTO } from '../dto/user.dto'

import { UserService } from '../user.service'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'

export class UserController {
  private static readonly UserService = UserService

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

  static readonly getUseFollowers = asyncHandler(
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

  static readonly getUseFollowing = asyncHandler(
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

  static readonly blockUser = asyncHandler(
    async (req: IRequest<IBlockUserDTO>, res: Response) => {
      const { id } = req.params
      const { _id: profileId } = req.profile
      await this.UserService.blockUser(profileId, id)
      return successResponse(res, {
        msg: 'user has been blocked successfully',
      })
    },
  )

  static readonly unblockUser = asyncHandler(
    async (req: IRequest<IUnBlockUserDTO>, res: Response) => {
      const { id } = req.params
      const { _id: profileId, blockedUsers } = req.profile
      await this.UserService.unblockUser(profileId, id, blockedUsers)
      return successResponse(res, {
        msg: 'user has been un-blocked successfully',
      })
    },
  )
}
