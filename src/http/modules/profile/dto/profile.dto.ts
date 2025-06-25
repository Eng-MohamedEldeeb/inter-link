import { IUserInputs } from '../../../../db/models/interfaces/IUser.interface'

export interface IUpdateProfileDTO
  extends Omit<
    IUserInputs,
    'password' | 'confirmPassword' | 'otpCode' | 'isPrivateProfile' | 'email'
  > {}

export interface IChangeEmailDTO extends Pick<IUserInputs, 'password'> {
  newEmail: string
}

export interface IConfirmNewEmailDTO
  extends Pick<IUserInputs, 'email' | 'otpCode'> {}

export interface IDeleteAccountDTO
  extends Pick<IUserInputs, 'email' | 'password'> {}

export interface IConfirmDeleteDTO
  extends Pick<IUserInputs, 'email' | 'otpCode'> {}
