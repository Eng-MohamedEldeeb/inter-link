import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { Response } from 'express'
import { AuthService } from '../auth.service'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import {
  IConfirmEmail,
  IForgotPassword,
  ILogin,
  IResetPassword,
  IRegister,
} from '../dto/auth.dto'

export class AuthController {
  private static readonly AuthService = AuthService

  static readonly confirmEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmEmail: IConfirmEmail = req.body
      await this.AuthService.confirmEmail(confirmEmail)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
      })
    },
  )

  static readonly register = asyncHandler(
    async (req: IRequest, res: Response) => {
      const register: IRegister = req.body
      return successResponse(res, {
        msg: 'user created successfully',
        status: 201,
        data: await this.AuthService.register(register),
      })
    },
  )

  static readonly login = asyncHandler(async (req: IRequest, res: Response) => {
    const login: ILogin = req.body
    return successResponse(res, {
      msg: 'logged in successfully',
      data: {
        accessToken: await this.AuthService.login(login),
      },
    })
  })

  static readonly forgotPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const forgotPassword: IForgotPassword = req.body
      await this.AuthService.forgotPassword(forgotPassword)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
      })
    },
  )

  static readonly resetPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const resetPassword: IResetPassword = req.body
      await this.AuthService.resetPassword(resetPassword)
      return successResponse(res, {
        msg: 'password has been reset successfully',
      })
    },
  )
}
