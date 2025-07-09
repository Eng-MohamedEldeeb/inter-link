import otpRepository from '../../common/repositories/otp.repository'
import userRepository from '../../common/repositories/user.repository'
import { throwError } from '../../common/handlers/error-message.handler'
import { compareValues } from '../../common/utils/security/bcrypt/bcrypt.service'
import { signToken } from '../../common/utils/security/token/token.service'
import {
  IConfirmEmailDTO,
  IForgotPasswordDTO,
  ILoginDTO,
  IResetPasswordDTO,
  IRegisterDTO,
} from './dto/auth.dto'
import { OtpType } from '../../db/models/enums/otp.enum'

export class AuthService {
  private static readonly userRepository = userRepository
  private static readonly otpRepository = otpRepository

  static readonly confirmEmail = async (confirmEmailDTO: IConfirmEmailDTO) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: { email: confirmEmailDTO.email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (isExistedUser)
      return throwError({ msg: 'user already exists', status: 409 })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: confirmEmailDTO.email },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedOtp)
      return throwError({
        msg: 'code was already sent, check your e-mail or wait for 15m to request another code',
        status: 409,
      })

    await this.otpRepository.create({
      email: confirmEmailDTO.email,
      type: OtpType.confirmRegistration,
    })
  }

  static readonly register = async (
    registerDTO: Omit<
      IRegisterDTO,
      'avatar' | 'confirmPassword' | 'bio' | 'isPrivateProfile'
    >,
  ) => {
    const { fullName, username, email, password, phone, birthDate, otpCode } =
      registerDTO

    const isConflicted = await this.userRepository.findOne({
      filter: {
        $or: [{ email }, { username }],
      },
    })

    if (isConflicted)
      return throwError({
        msg: 'e-mail and username must be unique',
        status: 400,
      })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email, type: OtpType.confirmRegistration },
      projection: { _id: 1, otpCode: 1 },
      options: { lean: true },
    })

    if (!isExistedOtp) return throwError({ msg: 'in-valid code', status: 400 })

    const validOtp = compareValues({
      value: otpCode,
      hashedValue: isExistedOtp.otpCode,
    })

    if (!validOtp) return throwError({ msg: 'in-valid code', status: 400 })

    await this.userRepository.create({
      fullName,
      username,
      email,
      password,
      phone,
      birthDate,
    })
  }

  static readonly login = async (loginDTO: ILoginDTO) => {
    const { username, password } = loginDTO

    const isExistedUser = await this.userRepository.findOne({
      filter: { username },
      projection: { _id: 1, username: 1, password: 1, deactivatedAt: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({
        msg: 'in-valid username or password',
        status: 400,
      })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: isExistedUser.password,
    })

    if (!isMatchedPasswords)
      return throwError({
        msg: 'in-valid username or password',
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
        expiresIn: '7d',
      },
    })

    return accessToken
  }

  static readonly forgotPassword = async (
    forgotPasswordDTO: IForgotPasswordDTO,
  ) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: { email: forgotPasswordDTO.email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (!isExistedUser) throw { msg: 'in-valid email', status: 400 }

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: forgotPasswordDTO.email, type: OtpType.forgotPassword },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedOtp)
      return throwError({
        msg: 'code was already sent, check your e-mail or wait for 15m to request another code',
        status: 409,
      })

    await this.otpRepository.create({
      email: forgotPasswordDTO.email,
      type: OtpType.forgotPassword,
    })
  }

  static readonly resetPassword = async (
    resetPasswordDTO: IResetPasswordDTO,
  ) => {
    const { email, newPassword, confirmPassword, otpCode } = resetPasswordDTO

    const isExistedUser = await this.userRepository.findOne({
      filter: { email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (!isExistedUser) throw { msg: 'in-valid email', status: 400 }

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email, type: OtpType.forgotPassword },
      projection: { _id: 1, otpCode: 1 },
      options: { lean: true },
    })

    if (!isExistedOtp)
      return throwError({ msg: 'code is expired', status: 400 })

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: isExistedOtp.otpCode,
    })

    if (!isMatchedOtp)
      return throwError({ msg: 'code is in-valid', status: 400 })

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
