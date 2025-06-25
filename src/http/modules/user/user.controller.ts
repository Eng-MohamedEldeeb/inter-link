import { successResponse } from '../../common/utils/handlers/success-response.handler'
import { asyncHandler } from '../../common/decorators/async-handler.decorator'
import {
  IBlockUserDTO,
  IGetUserProfileDTO,
  IUnBlockUserDTO,
} from './dto/user.dto'

import { UserService } from './user.service'

export class UserController {
  private static readonly UserService: typeof UserService = UserService

  static readonly getUserProfile = asyncHandler<IGetUserProfileDTO>(
    async (req, res) => {
      const user = req.user
      return successResponse(res, {
        msg: 'profile Picture been updated successfully',
        status: 200,
        data: await this.UserService.getUserProfile(user),
      })
    },
  )

  static readonly blockUser = asyncHandler<IBlockUserDTO>(async (req, res) => {
    const { id } = req.params
    await this.UserService.blockUser(id)
    return successResponse(res, {
      msg: 'user has been blocked successfully',
      status: 200,
    })
  })

  static readonly unblockUser = asyncHandler<IUnBlockUserDTO>(
    async (req, res) => {
      const { id } = req.params
      await this.UserService.unblockUser(id)
      return successResponse(res, {
        msg: 'user has been un-blocked successfully',
        status: 200,
      })
    },
  )
}
