import { Response } from "express"

import { asyncHandler } from "../../../../common/decorators/async-handler/async-handler.decorator"
import { successResponse } from "../../../../common/handlers/success-response.handler"
import { IRequest } from "../../../../common/interface/IRequest.interface"
import authService from "../auth.service"

import * as DTO from "../dto/auth.dto"

class AuthController {
  private readonly authService = authService

  public readonly confirmEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmEmailDTO: DTO.IConfirmEmail = req.body
      await this.authService.confirmEmail(confirmEmailDTO)
      return successResponse(res, {
        msg: "Check your E-mail for a confirmation code",
      })
    },
  )

  public readonly register = asyncHandler(
    async (req: IRequest, res: Response) => {
      const registerDTO: DTO.IRegister = req.body
      return successResponse(res, {
        msg: `Registered Successfully, Welcome ${registerDTO.username}`,
        status: 201,
        data: await this.authService.register(registerDTO),
      })
    },
  )

  public readonly login = asyncHandler(async (req: IRequest, res: Response) => {
    const loginDTO: DTO.ILogin = req.body
    return successResponse(res, {
      msg: `Welcome Back ${loginDTO.username}`,
      data: await this.authService.login(loginDTO),
    })
  })

  public readonly forgotPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const forgotPasswordDTO: DTO.IForgotPassword = req.body
      await this.authService.forgotPassword(forgotPasswordDTO)
      return successResponse(res, {
        msg: "Check your E-mail to confirm",
      })
    },
  )

  public readonly resetPassword = asyncHandler(
    async (req: IRequest, res: Response) => {
      const resetPasswordDTO: DTO.IResetPassword = req.body
      await this.authService.resetPassword(resetPasswordDTO)
      return successResponse(res, {
        msg: "Password has been reset successfully",
      })
    },
  )
}

export default new AuthController()
