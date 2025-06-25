import { IUserInputs } from '../../../../db/models/interfaces/IUser.interface'

export interface IDeleteAccountDTO
  extends Pick<IUserInputs, 'email' | 'password'> {}

export interface IConfirmDeleteDTO
  extends Pick<IUserInputs, 'email' | 'otpCode'> {}
