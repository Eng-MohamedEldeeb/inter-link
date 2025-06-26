import { asyncHandler } from '../../../common/decorators/async-handler.decorator'
import { IRequest } from '../../../common/interface/http/IRequest.interface'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import {
  IConfirmEmailDTO,
  IForgotPasswordDTO,
  ILoginDTO,
  IResetPasswordDTO,
  IRegisterDTO,
} from './dto/auth.dto'

export class AuthController {
  private static readonly AuthService: typeof AuthService = AuthService

  static readonly confirmEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmEmailDTO: IConfirmEmailDTO = req.body
      await this.AuthService.confirmEmail(confirmEmailDTO)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
        status: 200,
      })
    },
  )

  static readonly register = asyncHandler(
    async (req: IRequest, res: Response) => {
      const registerDTO: IRegisterDTO = req.body
      return successResponse(res, {
        msg: 'user created successfully',
        data: await this.AuthService.register(registerDTO),
      })
    },
  )

  static readonly login = asyncHandler(async (req: IRequest, res: Response) => {
    const loginDTO: ILoginDTO = req.body
    return successResponse(res, {
      msg: 'logged in successfully',
      status: 200,
      data: {
        accessToken: await this.AuthService.login(loginDTO),
      },
    })
  })

  static readonly forgotPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const forgotPasswordDTO: IForgotPasswordDTO = req.body
      await this.AuthService.forgotPassword(forgotPasswordDTO)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
        status: 200,
      })
    },
  )

  static readonly resetPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const resetPasswordDTO: IResetPasswordDTO = req.body
      await this.AuthService.resetPassword(resetPasswordDTO)
      return successResponse(res, {
        msg: 'password has been reset successfully',
        status: 200,
      })
    },
  )
}
