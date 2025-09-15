import { IUserInputs } from "../../../../db/interfaces/IUser.interface"

export interface IUpdateProfile
  extends Omit<
    IUserInputs,
    | "avatar"
    | "email"
    | "password"
    | "confirmPassword"
    | "otpCode"
    | "isPrivateProfile"
  > {}

export interface IChangeEmail extends Pick<IUserInputs, "password"> {
  originalEmail: string
  newEmail: string
}

export interface IConfirmNewEmail extends Pick<IUserInputs, "otpCode"> {
  originalEmail: string
}

export interface IDeleteAccount
  extends Pick<IUserInputs, "email" | "password"> {}

export interface IConfirmDelete
  extends Pick<IUserInputs, "email" | "otpCode"> {}
