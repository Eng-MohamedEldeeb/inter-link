import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { Response } from 'express'
import { AuthService } from '../auth.service'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import {
  IConfirmEmailDTO,
  IForgotPasswordDTO,
  ILoginDTO,
  IResetPasswordDTO,
  IRegisterDTO,
} from '../dto/auth.dto'

export class AuthController {
  private static readonly AuthService = AuthService

  static readonly confirmEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmEmailDTO: IConfirmEmailDTO = req.body
      await this.AuthService.confirmEmail(confirmEmailDTO)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
      })
    },
  )

  static readonly register = asyncHandler(
    async (req: IRequest, res: Response) => {
      const registerDTO: IRegisterDTO = req.body
      return successResponse(res, {
        msg: 'user created successfully',
        status: 201,
        data: await this.AuthService.register(registerDTO),
      })
    },
  )

  static readonly login = asyncHandler(async (req: IRequest, res: Response) => {
    const loginDTO: ILoginDTO = req.body
    return successResponse(res, {
      msg: 'logged in successfully',
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
      })
    },
  )

  static readonly resetPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const resetPasswordDTO: IResetPasswordDTO = req.body
      await this.AuthService.resetPassword(resetPasswordDTO)
      return successResponse(res, {
        msg: 'password has been reset successfully',
      })
    },
  )
}
