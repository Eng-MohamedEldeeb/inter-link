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
      return successResponse(res, {
        msg: 'profile Picture been updated successfully',
        status: 200,
        data: await this.UserService.getUserProfile(user),
      })
    },
  )

  static readonly blockUser = asyncHandler(
    async (req: IRequest<IBlockUserDTO>, res: Response) => {
      const { id } = req.params
      await this.UserService.blockUser(id)
      return successResponse(res, {
        msg: 'user has been blocked successfully',
        status: 200,
      })
    },
  )

  static readonly unblockUser = asyncHandler(
    async (req: IRequest<IUnBlockUserDTO>, res: Response) => {
      const { id } = req.params
      await this.UserService.unblockUser(id)
      return successResponse(res, {
        msg: 'user has been un-blocked successfully',
        status: 200,
      })
    },
  )
}
