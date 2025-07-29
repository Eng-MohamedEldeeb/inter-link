import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { successResponse } from '../../../common/handlers/success-response.handler'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { Response } from 'express'
import { AuthService } from '../auth.service'

import * as DTO from '../dto/auth.dto'

export class AuthController {
  private static readonly AuthService = AuthService

  public static readonly confirmEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmEmail: DTO.IConfirmEmail = req.body
      await this.AuthService.confirmEmail(confirmEmail)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
      })
    },
  )

  public static readonly register = asyncHandler(
    async (req: IRequest, res: Response) => {
      const register: DTO.IRegister = req.body
      return successResponse(res, {
        msg: `Account is created Successfully, Welcome ${register.username}`,
        status: 201,
        data: { accessToken: await this.AuthService.register(register) },
      })
    },
  )

  public static readonly login = asyncHandler(
    async (req: IRequest, res: Response) => {
      const login: DTO.ILogin = req.body
      return successResponse(res, {
        msg: `Welcome Back ${login.username}`,
        data: { accessToken: await this.AuthService.login(login) },
      })
    },
  )

  public static readonly forgotPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const forgotPassword: DTO.IForgotPassword = req.body
      await this.AuthService.forgotPassword(forgotPassword)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
      })
    },
  )

  public static readonly resetPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const resetPassword: DTO.IResetPassword = req.body
      await this.AuthService.resetPassword(resetPassword)
      return successResponse(res, {
        msg: 'password is reset successfully',
      })
    },
  )
}
