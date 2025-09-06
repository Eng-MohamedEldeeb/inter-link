import { Response } from "express"

import { asyncHandler } from "../../../common/decorators/async-handler/async-handler.decorator"
import { successResponse } from "../../../common/handlers/success-response.handler"
import { IRequest } from "../../../common/interface/IRequest.interface"
import { AuthService } from "../auth.service"

import * as DTO from "../dto/auth.dto"

export class AuthController {
  private static readonly AuthService = AuthService

  public static readonly confirmEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmEmailDTO: DTO.IConfirmEmail = req.body
      await this.AuthService.confirmEmail(confirmEmailDTO)
      return successResponse(res, {
        msg: "Check your E-mail for a confirmation code",
      })
    },
  )

  public static readonly register = asyncHandler(
    async (req: IRequest, res: Response) => {
      const registerDTO: DTO.IRegister = req.body
      return successResponse(res, {
        msg: `Registered Successfully, Welcome ${registerDTO.username}`,
        status: 201,
        data: { accessToken: await this.AuthService.register(registerDTO) },
      })
    },
  )

  public static readonly login = asyncHandler(
    async (req: IRequest, res: Response) => {
      const loginDTO: DTO.ILogin = req.body
      return successResponse(res, {
        msg: `Welcome Back ${loginDTO.username}`,
        data: { accessToken: await this.AuthService.login(loginDTO) },
      })
    },
  )

  public static readonly forgotPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const forgotPasswordDTO: DTO.IForgotPassword = req.body
      await this.AuthService.forgotPassword(forgotPasswordDTO)
      return successResponse(res, {
        msg: "Check your E-mail to confirm",
      })
    },
  )

  public static readonly resetPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const resetPasswordDTO: DTO.IResetPassword = req.body
      await this.AuthService.resetPassword(resetPasswordDTO)
      return successResponse(res, {
        msg: "Password has been reset successfully",
      })
    },
  )
}
