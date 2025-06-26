import otpRepository from '../../../common/repositories/otp.repository'
import userRepository from '../../../common/repositories/user.repository'
import { throwGraphError } from '../../../common/handlers/graphql/error.handler'
import { Types } from 'mongoose'
import { IUser } from '../../../db/models/interfaces/IUser.interface'
import { decryptValue } from '../../../common/utils/security/crypto/crypto.service'

export class ProfileService {
  protected static readonly userRepository = userRepository
  protected static readonly otpRepository = otpRepository

  static readonly getProfile = async (user: IUser) => {
    return {
      ...user,
      phone: decryptValue({ encryptedValue: user.phone }),
    }
  }
}
