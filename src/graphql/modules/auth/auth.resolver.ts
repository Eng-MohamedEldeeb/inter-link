import {
  IConfirmEmailDto,
  IForgotPasswordDto,
  ILoginDto,
  IResetPasswordDto,
  IRegisterDto,
} from './dto/auth.dto'
import { AuthService } from './auth.service'
import { ISuccessResponse } from '../../common/interface/IGraphQL.types'

export class AuthResolver {
  protected static readonly AuthService = AuthService

  static readonly confirmEmail = async (
    args: IConfirmEmailDto,
  ): Promise<ISuccessResponse> => {
    const confirmEmailDto: IConfirmEmailDto = args
    await this.AuthService.confirmEmail(confirmEmailDto)
    return { msg: 'check your e-mail to confirm', status: 200 }
  }

  static readonly register = async (
    args: IRegisterDto,
  ): Promise<ISuccessResponse> => {
    const registerDto: IRegisterDto = args
    await this.AuthService.register(registerDto)
    return { msg: 'User has been saved successfully', status: 201 }
  }

  static readonly login = async (
    args: ILoginDto,
  ): Promise<ISuccessResponse> => {
    const loginDto: ILoginDto = args
    const { msg, data } = await this.AuthService.login(loginDto)
    return { msg, status: 200, data }
  }

  static readonly forgotPassword = async (
    args: IForgotPasswordDto,
  ): Promise<ISuccessResponse> => {
    const forgotPasswordDto: IForgotPasswordDto = args
    await this.AuthService.forgotPassword(forgotPasswordDto)
    return { msg: 'check your e-mail for the verification code', status: 200 }
  }

  static readonly resetPassword = async (
    args: IResetPasswordDto,
  ): Promise<ISuccessResponse> => {
    const resetPasswordDto: IResetPasswordDto = args
    await this.AuthService.resetPassword(resetPasswordDto)
    return { msg: 'password has been rested successfully', status: 200 }
  }
}
