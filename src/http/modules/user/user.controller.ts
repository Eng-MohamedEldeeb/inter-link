import { Response } from 'express'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { IRequest } from '../../../common/interface/http/IRequest.interface'
import { IBlockUserDTO, IUnBlockUserDTO } from './dto/user.dto'

import { UserService } from './user.service'
import { asyncHandler } from '../../../common/decorators/async-handler.decorator'

export class UserController {
  private static readonly UserService: typeof UserService = UserService

  static readonly getUserProfile = asyncHandler(
    async (req: IRequest, res: Response) => {
      const user = req.user
      const profile = req.profile
      if (user._id.equals(profile._id)) return res.redirect('/api/v1/profile')
      return successResponse(res, {
        msg: 'done',
        status: 200,
        data: await this.UserService.getUserProfile(user),
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
        msg: 'done',
        status: 200,
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
        msg: 'done',
        status: 200,
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
        status: 200,
      })
    },
  )

  static readonly unblockUser = asyncHandler(
    async (req: IRequest<IUnBlockUserDTO>, res: Response) => {
      const { id } = req.params
      const { _id: profileId, blockList } = req.profile
      await this.UserService.unblockUser(profileId, id, blockList)
      return successResponse(res, {
        msg: 'user has been un-blocked successfully',
        status: 200,
      })
    },
  )
}
