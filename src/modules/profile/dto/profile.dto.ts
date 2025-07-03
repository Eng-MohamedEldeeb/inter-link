import { IUserInputs } from '../../../db/interface/IUser.interface'

export interface IUpdateProfileDTO
  extends Omit<
    IUserInputs,
    | 'avatar'
    | 'email'
    | 'password'
    | 'confirmPassword'
    | 'otpCode'
    | 'isPrivateProfile'
  > {}

export interface IChangeEmailDTO extends Pick<IUserInputs, 'password'> {
  originalEmail: string
  newEmail: string
}

export interface IConfirmNewEmailDTO extends Pick<IUserInputs, 'otpCode'> {
  originalEmail: string
}

export interface IDeleteAccountDTO
  extends Pick<IUserInputs, 'email' | 'password'> {}

export interface IConfirmDeleteDTO
  extends Pick<IUserInputs, 'email' | 'otpCode'> {}
