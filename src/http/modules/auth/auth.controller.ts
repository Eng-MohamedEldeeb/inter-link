import { asyncHandler } from '../../common/decorators/async-handler.decorator'
import authService from './auth.service'
import { successResponse } from '../../../common/utils/handlers/success-response.handler'
import {
  IConfirmDeleteDto,
  IConfirmEmailDto,
  IDeleteAccountDto,
  IForgotPasswordDto,
  ILoginDto,
  IResetPasswordDto,
  IRegisterDto,
} from './dto/auth.dto'
import { IRequest } from '../../common/interface/IRequest.interface'
import { Response } from 'express'

export class AuthController {
  private static readonly authService: typeof authService = authService

  static readonly confirmEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmEmailDto: IConfirmEmailDto = req.body
      await this.authService.confirmEmail(confirmEmailDto)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
        status: 200,
      })
    },
  )

  static readonly register = asyncHandler(
    async (req: IRequest, res: Response) => {
      const registerDto: IRegisterDto = req.body
      return successResponse(res, {
        msg: 'user created successfully',
        data: await this.authService.register(registerDto),
      })
    },
  )

  static readonly login = asyncHandler(async (req: IRequest, res: Response) => {
    const loginDto: ILoginDto = req.body
    return successResponse(res, {
      msg: 'logged in successfully',
      status: 200,
      data: {
        accessToken: await this.authService.login(loginDto),
      },
    })
  })

  static readonly forgotPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const forgotPasswordDto: IForgotPasswordDto = req.body
      await this.authService.forgotPassword(forgotPasswordDto)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
        status: 200,
      })
    },
  )

  static readonly resetPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const resetPasswordDto: IResetPasswordDto = req.body
      await this.authService.resetPassword(resetPasswordDto)
      return successResponse(res, {
        msg: 'password has been reset successfully',
        status: 200,
      })
    },
  )

  static readonly deleteAccount = asyncHandler(
    async (req: IRequest, res: Response) => {
      const deleteAccountDto: IDeleteAccountDto = req.body
      await this.authService.deleteAccount(deleteAccountDto)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
        status: 200,
      })
    },
  )

  static readonly confirmDeleting = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmDeleteDto: IConfirmDeleteDto = req.body
      await this.authService.confirmDeleting(confirmDeleteDto)
      return successResponse(res, {
        msg: 'Account has been deleted successfully',
        status: 200,
      })
    },
  )
}
