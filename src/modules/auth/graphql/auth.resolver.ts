import { ISuccessResponse } from "../../../common/interface/IGraphQL.interface"
import { AuthService } from "../auth.service"

import * as DTO from "../dto/auth.dto"

class AuthResolver {
  protected readonly AuthService = AuthService

  public readonly confirmEmail = async (
    args: DTO.IConfirmEmail,
    _: any,
  ): Promise<ISuccessResponse> => {
    await this.AuthService.confirmEmail(args)
    return { msg: "Check your E-mail for a confirmation code" }
  }

  public readonly register = async (
    args: DTO.IRegister,
    _: any,
  ): Promise<ISuccessResponse> => {
    return {
      msg: `Registered Successfully, Welcome ${args.username}`,
      status: 201,
      data: { accessToken: await this.AuthService.register(args) },
    }
  }

  public readonly login = async (
    args: DTO.ILogin,
    _: any,
  ): Promise<ISuccessResponse> => {
    return {
      msg: `Welcome Back ${args.username}`,
      data: { accessToken: await this.AuthService.login(args) },
    }
  }

  public readonly forgotPassword = async (
    args: DTO.IForgotPassword,
    _: any,
  ) => {
    await this.AuthService.forgotPassword(args)
    return { msg: "Check your E-mail to confirm" }
  }

  public readonly resetPassword = async (
    args: DTO.IResetPassword,
    _: any,
  ): Promise<ISuccessResponse> => {
    await this.AuthService.resetPassword(args)
    return { msg: "Password has been reset successfully" }
  }
}
export default new AuthResolver()
