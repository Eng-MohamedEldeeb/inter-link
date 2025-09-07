import otpRepository from "../../common/repositories/otp.repository"
import userRepository from "../../common/repositories/user.repository"

import * as DTO from "./dto/auth.dto"

import { throwError } from "../../common/handlers/error-message.handler"
import { compareValues } from "../../common/utils/security/bcrypt/bcrypt.service"
import { signToken } from "../../common/utils/security/token/token.service"
import { OtpType } from "../../db/models/enums/otp.enum"

class AuthService {
  private readonly userRepository = userRepository
  private readonly otpRepository = otpRepository

  public readonly confirmEmail = async (confirmEmail: DTO.IConfirmEmail) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: { email: confirmEmail.email },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedUser)
      return throwError({
        msg: "This E-mail already registered, Try to login instead",
        status: 409,
      })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: confirmEmail.email },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedOtp)
      return throwError({
        msg: "Confirmation code was already sent to you E-mail, check your e-mail or wait for 15m to request another code",
        status: 409,
      })

    await this.otpRepository.create({
      email: confirmEmail.email,
      type: OtpType.confirmRegistration,
    })
  }

  public readonly register = async (
    register: Omit<
      DTO.IRegister,
      "avatar" | "confirmPassword" | "bio" | "isPrivateProfile"
    >,
  ) => {
    const { username, email, password, phone, birthDate, otpCode } = register

    const isAlreadyExisted = await this.userRepository.findOne({
      filter: {
        $or: [{ email }, { username }],
      },
      projection: { email: 1, username: 1 },
      options: { lean: true },
    })

    // if (isAlreadyExisted && isAlreadyExisted.username.match(username))
    //   return true

    if (isAlreadyExisted)
      return throwError({
        msg: "User with the same E-mail or Username already exists",
        status: 400,
      })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email, type: OtpType.confirmRegistration },
      projection: { _id: 1, otpCode: 1 },
      options: { lean: true },
    })

    if (!isExistedOtp)
      return throwError({
        msg: "Confirmation code has been expired",
        status: 400,
      })

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: isExistedOtp.otpCode,
    })

    if (!isMatchedOtp)
      return throwError({ msg: "Invalid confirmation code", status: 400 })

    await this.userRepository.create({
      username,
      email,
      password,
      phone,
      birthDate,
    })

    return await this.login({ username, password })
  }

  public readonly login = async (login: DTO.ILogin) => {
    const { username, password } = login

    const isExistedUser = await this.userRepository.findOne({
      filter: { username },
      projection: { _id: 1, username: 1, password: 1, deactivatedAt: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({
        msg: "Incorrect username or password",
        status: 400,
      })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: isExistedUser.password,
    })

    if (!isMatchedPasswords)
      return throwError({
        msg: "Incorrect username or password",
        status: 400,
      })

    if (isExistedUser.deactivatedAt)
      await this.userRepository.findOneAndUpdate({
        filter: { $and: [{ username }, { deactivatedAt: { $exists: true } }] },
        data: {
          $unset: { deactivatedAt: 1 },
        },
      })

    const accessToken = signToken({
      payload: {
        _id: isExistedUser._id,
      },
      options: {
        expiresIn: "7d",
      },
    })

    return accessToken
  }

  public readonly forgotPassword = async (
    forgotPassword: DTO.IForgotPassword,
  ) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: { email: forgotPassword.email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (!isExistedUser) throw { msg: "Invalid email", status: 400 }

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: forgotPassword.email, type: OtpType.forgotPassword },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedOtp)
      return throwError({
        msg: "code was already sent, check your e-mail or wait for 15m to request another code",
        status: 409,
      })

    await this.otpRepository.create({
      email: forgotPassword.email,
      type: OtpType.forgotPassword,
    })
  }

  public readonly resetPassword = async (resetPassword: DTO.IResetPassword) => {
    const { email, newPassword, otpCode } = resetPassword

    const isExistedUser = await this.userRepository.findOne({
      filter: { email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (!isExistedUser) throw { msg: "Invalid email", status: 400 }

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email, type: OtpType.forgotPassword },
      projection: { _id: 1, otpCode: 1 },
      options: { lean: true },
    })

    if (!isExistedOtp)
      return throwError({ msg: "code is expired", status: 400 })

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: isExistedOtp.otpCode,
    })

    if (!isMatchedOtp)
      return throwError({ msg: "code is Invalid", status: 400 })

    await this.userRepository.findByIdAndUpdate({
      _id: isExistedUser._id,
      data: {
        password: newPassword,
        changedCredentialsAt: Date.now(),
      },
      options: {
        lean: true,
        new: true,
      },
    })
  }
}
export default new AuthService()
