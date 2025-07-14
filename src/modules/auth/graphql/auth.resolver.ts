import { ISuccessResponse } from '../../../common/interface/IGraphQL.interface'
import { AuthService } from '../auth.service'
import {
  IConfirmEmailDTO,
  IForgotPasswordDTO,
  ILoginDTO,
  IRegisterDTO,
  IResetPasswordDTO,
} from '../dto/auth.dto'

export class AuthResolver {
  protected static readonly AuthService = AuthService

  static readonly confirmEmail = async (
    args: IConfirmEmailDTO,
    _: any,
  ): Promise<ISuccessResponse> => {
    await this.AuthService.confirmEmail(args)
    return {
      msg: 'check your e-mail to confirm',
      status: 200,
    }
  }

  static readonly register = async (
    args: IRegisterDTO,
    _: any,
  ): Promise<ISuccessResponse> => {
    return {
      msg: 'user created successfully',
      status: 201,
      data: await this.AuthService.register(args),
    }
  }

  static readonly login = async (
    args: ILoginDTO,
    _: any,
  ): Promise<ISuccessResponse> => {
    return {
      msg: 'logged in successfully',
      status: 200,
      data: await this.AuthService.login(args),
    }
  }

  static readonly forgotPassword = async (args: IForgotPasswordDTO, _: any) => {
    return {
      msg: 'check your e-mail to confirm',
      status: 200,
      data: await this.AuthService.forgotPassword(args),
    }
  }

  static readonly resetPassword = async (
    args: IResetPasswordDTO,
    _: any,
  ): Promise<ISuccessResponse> => {
    return {
      msg: 'password has been reset successfully',
      status: 200,
      data: await this.AuthService.resetPassword(args),
    }
  }
}
