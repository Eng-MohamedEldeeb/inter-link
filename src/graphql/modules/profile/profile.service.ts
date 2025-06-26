import otpRepository from '../../../common/repositories/otp.repository'
import userRepository from '../../../common/repositories/user.repository'
import { throwGraphError } from '../../../common/handlers/graphql/error.handler'
import { Types } from 'mongoose'
import { IUser } from '../../../db/models/interfaces/IUser.interface'
import { decryptValue } from '../../../common/utils/security/crypto/crypto.service'
import { TUser } from '../../../db/models/types/document.type'

export class ProfileService {
  protected static readonly userRepository = userRepository
  protected static readonly otpRepository = otpRepository

  static readonly getProfile = async (user: IUser) => {
    console.log({
      ...user,
      totalFollowers: user.followers?.length ?? 0,
      totalFollowing: user.following?.length ?? 0,
      totalPosts: user.posts?.length ?? 0,
      phone: decryptValue({ encryptedValue: user.phone }),
    })

    return {
      ...user,
      totalFollowers: user.followers?.length ?? 0,
      totalFollowing: user.following?.length ?? 0,
      totalPosts: user.posts?.length ?? 0,
      phone: decryptValue({ encryptedValue: user.phone }),
    }
  }
}
