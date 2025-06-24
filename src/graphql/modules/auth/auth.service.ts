import otpRepository from '../../../common/repositories/otp.repository'
import userRepository from '../../../common/repositories/user.repository'
import { throwGraphError } from '../../../common/utils/handlers/error-message.handler'
import { compareValues } from '../../../common/utils/security/bcrypt/bcrypt.service'
import { signToken } from '../../../common/utils/security/token/token.service'
import {
  IConfirmEmailDto,
  IForgotPasswordDto,
  ILoginDto,
  IResetPasswordDto,
  IRegisterDto,
} from '../auth/dto/auth.dto'
import { OtpType } from '../../../db/models/enums/otp.enum'

export class AuthService {
  protected static readonly userRepository = userRepository
  protected static readonly otpRepository = otpRepository

  static readonly confirmEmail = async (confirmEmailDto: IConfirmEmailDto) => {
    const userExists = await this.userRepository.findOne({
      filter: { email: confirmEmailDto.email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (userExists) return throwGraphError('user already exists')

    const otpExists = await this.otpRepository.findOne({
      filter: { email: confirmEmailDto.email },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (otpExists)
      return throwGraphError(
        'code was already sent, check your e-mail or wait for 15m to request another code',
      )

    await this.otpRepository.create({
      email: confirmEmailDto.email,
      type: OtpType.confirm,
    })
  }

  static readonly register = async (
    registerDto: Omit<IRegisterDto, 'confirmPassword'>,
  ) => {
    const { email, otpCode, ...rest } = registerDto

    const otpExists = await this.otpRepository.findOne({
      filter: { email, type: OtpType.confirm },
      projection: { _id: 1, otpCode: 1 },
      options: { lean: true },
    })

    if (!otpExists) return throwGraphError('code is expired')

    const validOtp = compareValues({
      value: otpCode,
      hashedValue: otpExists.otpCode,
    })

    if (!validOtp) return throwGraphError('in-valid code')

    await this.userRepository.create({
      email,
      ...rest,
    })
  }

  static readonly login = async (loginDto: ILoginDto) => {
    const { username, password } = loginDto

    const userExists = await this.userRepository.findOne({
      filter: { username },
      projection: { _id: 1, username: 1, password: 1 },
      options: { lean: true },
    })

    if (!userExists) return throwGraphError('in-valid username or password')

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: userExists.password,
    })

    if (!isMatchedPasswords)
      return throwGraphError('in-valid username or password')

    const accessToken = signToken({
      payload: {
        _id: userExists._id,
      },
      options: {
        expiresIn: '7d',
      },
    })

    if (userExists.deactivatedAt) {
      await this.userRepository.findOneAndUpdate({
        filter: { username },
        data: { $unset: { deactivatedAt: 1 } },
        options: { lean: true, new: true },
      })

      return { msg: 'welcome back', data: { accessToken } }
    }
    return { msg: 'welcome', data: { accessToken } }
  }

  static readonly forgotPassword = async (
    forgotPasswordDto: IForgotPasswordDto,
  ) => {
    const userExists = await this.userRepository.findOne({
      filter: { email: forgotPasswordDto.email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (!userExists) throw { msg: 'in-valid email', status: 400 }

    const otpExists = await this.otpRepository.findOne({
      filter: { email: forgotPasswordDto.email, type: OtpType.forgot },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (otpExists)
      return throwGraphError(
        'code was already sent, check your e-mail or wait for 15m to request another code',
      )

    await this.otpRepository.create({
      email: forgotPasswordDto.email,
      type: OtpType.forgot,
    })
  }

  static readonly resetPassword = async (
    resetPasswordDto: IResetPasswordDto,
  ) => {
    const { email, newPassword, otpCode } = resetPasswordDto

    const userExists = await this.userRepository.findOne({
      filter: { email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (!userExists) throw { msg: 'in-valid email', status: 400 }

    const otpExists = await this.otpRepository.findOne({
      filter: { email, type: OtpType.forgot },
      projection: { _id: 1, otpCode: 1 },
      options: { lean: true },
    })

    if (!otpExists) return throwGraphError('code is expired')

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: otpExists.otpCode,
    })

    if (!isMatchedOtp) return throwGraphError('code is in-valid')

    await this.userRepository.findByIdAndUpdate({
      _id: userExists._id,
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
