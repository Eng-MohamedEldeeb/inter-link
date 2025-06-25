import { IUserInputs } from '../../../../db/models/interfaces/IUser.interface'

export interface IConfirmEmailDTO extends Pick<IUserInputs, 'email'> {}

export interface IRegisterDTO extends IUserInputs {}

export interface ILoginDTO extends Pick<IUserInputs, 'username' | 'password'> {}

export interface IForgotPasswordDTO extends Pick<IUserInputs, 'email'> {}

export interface IResetPasswordDTO
  extends Pick<IUserInputs, 'email' | 'confirmPassword' | 'otpCode'> {
  newPassword: string
}
