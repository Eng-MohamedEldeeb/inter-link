import { IUserInputs } from '../../../db/interface/IUser.interface'

export interface IConfirmEmailDTO extends Pick<IUserInputs, 'email'> {}

export interface IRegisterDTO extends Omit<IUserInputs, 'isPrivateProfile'> {}

export interface ILoginDTO extends Pick<IUserInputs, 'username' | 'password'> {}

export interface IForgotPasswordDTO extends Pick<IUserInputs, 'email'> {}

export interface IResetPasswordDTO
  extends Pick<IUserInputs, 'email' | 'confirmPassword' | 'otpCode'> {
  newPassword: string
}
