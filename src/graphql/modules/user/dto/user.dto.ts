import { IUserInputs } from '../../../../db/models/interfaces/IUser.interface'

export interface IDeleteAccountDto
  extends Pick<IUserInputs, 'email' | 'password'> {}

export interface IConfirmDeleteDto
  extends Pick<IUserInputs, 'email' | 'otpCode'> {}
