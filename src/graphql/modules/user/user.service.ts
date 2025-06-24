import otpRepository from '../../../common/repositories/otp.repository'
import userRepository from '../../../common/repositories/user.repository'
import { throwGraphError } from '../../../common/utils/handlers/error-message.handler'
import { compareValues } from '../../../common/utils/security/bcrypt/bcrypt.service'
import { IConfirmDeleteDto, IDeleteAccountDto } from './../user/dto/user.dto'
import { OtpType } from '../../../db/models/enums/otp.enum'
import { Types } from 'mongoose'
import { IUser } from '../../../db/models/interfaces/IUser.interface'
import { decryptValue } from '../../../common/utils/security/crypto/crypto.service'

export class UserService {
  protected static readonly userRepository = userRepository
  protected static readonly otpRepository = otpRepository

  static readonly getProfile = async (userId: Types.ObjectId, user: IUser) => {
    const userExists = await this.userRepository.findOne({
      filter: {
        _id: userId,
        deactivatedAt: { $exists: false },
      },
      options: { lean: true },
    })

    console.log({ userExists })

    if (!userExists) return throwGraphError('user not existed')
    console.log({
      ...userExists,
      phone: decryptValue({ encryptedValue: userExists.phone }),
    })

    return {
      ...userExists,
      phone: decryptValue({ encryptedValue: userExists.phone }),
    }
  }

  static readonly deleteAccount = async (
    deleteAccountDto: IDeleteAccountDto,
  ) => {
    const { email, password } = deleteAccountDto
    const userExists = await this.userRepository.findOne({
      filter: { email },
      projection: { email: 1, password: 1 },
      options: { lean: true },
    })

    if (!userExists) return throwGraphError('in-valid email or password')

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: userExists.password,
    })

    if (!isMatchedPasswords)
      return throwGraphError('in-valid email or password')

    const otpExists = await this.otpRepository.findOne({
      filter: { email: userExists.email, type: OtpType.verifyDeleting },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (otpExists)
      return throwGraphError(
        'code was already sent, check your e-mail or wait for 15m to request another code',
      )

    await this.otpRepository.create({
      email: userExists.email,
      type: OtpType.verifyDeleting,
    })
  }

  static readonly confirmDeleting = async (
    confirmDeletingDto: IConfirmDeleteDto,
  ) => {
    const { email, otpCode } = confirmDeletingDto

    const otpExists = await this.otpRepository.findOne({
      filter: {
        email,
        type: OtpType.verifyDeleting,
      },
    })

    if (!otpExists) return throwGraphError('code is expired')

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: otpExists.otpCode,
    })

    if (!isMatchedOtp) return throwGraphError('in-valid code')

    await this.userRepository.findOneAndDelete({
      filter: { email },
    })
  }
}
