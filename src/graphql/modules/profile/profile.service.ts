import otpRepository from '../../../common/repositories/otp.repository'
import userRepository from '../../../common/repositories/user.repository'
import { IUser } from '../../../db/models/interfaces/IUser.interface'
import { decryptValue } from '../../../common/utils/security/crypto/crypto.service'

export class ProfileService {
  protected static readonly userRepository = userRepository
  protected static readonly otpRepository = otpRepository

  static readonly getProfile = async () => {
    // return {
    //   ...user,
    //   totalFollowers: user.followers?.length ?? 0,
    //   totalFollowing: user.following?.length ?? 0,
    //   totalPosts: user.posts?.length ?? 0,
    //   phone: decryptValue({ encryptedValue: user.phone }),
    // }
    return 'hello'
  }
}
