import otpRepository from '../../common/repositories/otp.repository'
import userRepository from '../../common/repositories/user.repository'
import { throwError } from '../../common/handlers/error-message.handler'
import { compareValues } from '../../common/utils/security/bcrypt/bcrypt.service'
import { OtpType } from '../../db/models/enums/otp.enum'
import {
  IChangeEmailDTO,
  IConfirmDeleteDTO,
  IConfirmNewEmailDTO,
  IDeleteAccountDTO,
  IUpdateProfileDTO,
} from './dto/profile.dto'
import { CloudUploader } from '../../common/services/upload/cloud.service'
import { IUser } from '../../db/interface/IUser.interface'
import { decryptValue } from '../../common/utils/security/crypto/crypto.service'
import { MongoObjId } from '../../common/types/db/mongo.types'

export class ProfileService {
  private static readonly userRepository = userRepository
  private static readonly otpRepository = otpRepository
  private static readonly CloudUploader = CloudUploader

  static readonly getProfile = (profile: IUser) => {
    return {
      ...profile,
      totalFollowers: profile.followers.length ?? 0,
      totalFollowing: profile.following.length ?? 0,
      totalPosts: profile.posts?.length ?? 0,
      ...(profile.phone && {
        phone: decryptValue({ encryptedValue: profile.phone }),
      }),
    }
  }

  static readonly getFollowers = (profile: IUser) => {
    return {
      followers: profile.followers,
    }
  }

  static readonly getFollowing = (profile: IUser) => {
    return {
      following: profile.following,
    }
  }

  static readonly updateProfilePic = async (
    userId: MongoObjId,
    path: string,
  ) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: { _id: userId, deactivatedAt: { $exists: false } },
      projection: { _id: 1, avatar: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: "user doesn't exist", status: 404 })

    const hasDefaultAvatar =
      isExistedUser.avatar.secure_url == process.env.DEFAULT_PROFILE_AVATAR_PIC

    if (!hasDefaultAvatar) {
      const { secure_url, public_id } = await this.CloudUploader.upload({
        path,
        public_id: isExistedUser.avatar.public_id,
      })

      return await this.userRepository.findByIdAndUpdate({
        _id: userId,
        data: {
          avatar: { secure_url, public_id },
        },
        options: { new: true, lean: true, projection: { avatar: 1 } },
      })
    }

    const { secure_url, public_id } = await this.CloudUploader.upload({
      path,
      folderName: `${process.env.APP_NAME}/${userId.toString()}/avatar`,
    })

    return await this.userRepository.findByIdAndUpdate({
      _id: userId,
      data: {
        avatar: { secure_url, public_id },
      },
      options: {
        new: true,
        lean: true,
        projection: { 'avatar.secure_url': 1 },
      },
    })
  }

  static readonly deleteProfilePic = async (userId: MongoObjId) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: { _id: userId, deactivatedAt: { $exists: false } },
      projection: { _id: 1, avatar: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: "user doesn't exist", status: 404 })

    const hasDefaultAvatar =
      isExistedUser.avatar.secure_url == process.env.DEFAULT_PROFILE_AVATAR_PIC

    if (hasDefaultAvatar)
      return throwError({
        msg: "user already doesn't have a profile avatar",
        status: 400,
      })

    await this.CloudUploader.delete(isExistedUser.avatar.public_id)

    return await this.userRepository.findByIdAndUpdate({
      _id: userId,
      data: {
        $set: {
          avatar: { secure_url: process.env.DEFAULT_PROFILE_AVATAR_PIC },
        },
      },
      options: {
        new: true,
        lean: true,
        projection: { 'avatar.secure_url': 1 },
      },
    })
  }

  static readonly updateProfile = async (
    userId: MongoObjId,
    updateProfileDTO: IUpdateProfileDTO,
  ) => {
    const { username } = updateProfileDTO
    const isExistedUser = await this.userRepository.findOne({
      filter: {
        _id: userId,
        deactivatedAt: { $exists: false },
      },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: "user doesn't exist", status: 404 })

    const isConflictedUsername =
      username &&
      (await this.userRepository.findOne({
        filter: { username },
        projection: { _id: 1 },
      }))

    if (isConflictedUsername)
      return throwError({ msg: 'username is taken', status: 409 })

    return await this.userRepository.findByIdAndUpdate({
      _id: userId,
      data: updateProfileDTO,
      options: {
        lean: true,
        new: true,
        projection: Object.keys(updateProfileDTO).join(' '),
      },
    })
  }

  static readonly changeVisibility = async (userId: MongoObjId) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: {
        _id: userId,
        deactivatedAt: { $exists: false },
      },
    })

    if (!isExistedUser)
      return throwError({ msg: "user doesn't exist", status: 404 })

    await isExistedUser.updateOne(
      { isPrivateProfile: !Boolean(isExistedUser.isPrivateProfile) },
      {
        lean: true,
        new: true,
        projection: { isPrivateProfile: 1 },
      },
    )
  }

  static readonly changeEmail = async (
    userId: MongoObjId,
    changeEmailDTO: IChangeEmailDTO,
  ) => {
    const { originalEmail, newEmail, password } = changeEmailDTO

    const isExistedUser = await this.userRepository.findOne({
      filter: {
        $and: [
          { _id: userId },
          { email: originalEmail },
          { deactivatedAt: { $exists: false } },
        ],
      },
      projection: { password: 1 },
    })

    if (!isExistedUser)
      return throwError({ msg: "user doesn't exist", status: 404 })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: isExistedUser.password,
    })

    if (!isMatchedPasswords)
      return throwError({ msg: 'in-valid password', status: 400 })

    const conflictedEmail = await this.userRepository.findOne({
      filter: {
        email: newEmail,
      },
      projection: { _id: 1 },
    })

    if (conflictedEmail)
      return throwError({ msg: 'e-mail already exists', status: 409 })

    Promise.allSettled([
      otpRepository.create({
        email: originalEmail,
        type: OtpType.confirmNewEmail,
      }),
      isExistedUser.updateOne({ tempEmail: newEmail }),
    ])
  }

  static readonly confirmNewEmail = async (
    confirmEmailDTO: IConfirmNewEmailDTO,
  ) => {
    const { originalEmail, otpCode } = confirmEmailDTO

    const isExistedUser = await this.userRepository.findOne({
      filter: {
        $and: [{ email: originalEmail }, { deactivatedAt: { $exists: false } }],
      },
      projection: { email: 1, tempEmail: 1 },
    })

    if (!isExistedUser)
      return throwError({ msg: "user doesn't exist", status: 409 })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: originalEmail },
      projection: { _id: 1, otpCode: 1 },
    })

    if (!isExistedOtp)
      return throwError({
        msg: 'expired verification code',
        status: 400,
      })

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: isExistedOtp.otpCode,
    })

    if (!isMatchedOtp)
      return throwError({
        msg: 'in-valid verification code',
        status: 400,
      })

    Promise.allSettled([
      isExistedUser.updateOne({
        email: isExistedUser.tempEmail,
        $unset: { tempEmail: 1 },
      }),
      isExistedOtp.deleteOne(),
    ])
  }

  static readonly deactivateAccount = async (
    deleteAccountDTO: IDeleteAccountDTO,
  ) => {
    const { email, password } = deleteAccountDTO
    const isExistedUser = await this.userRepository.findOne({
      filter: { $and: [{ email }, { deactivatedAt: { $exists: false } }] },
      projection: { email: 1, password: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: 'in-valid email or password', status: 400 })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: isExistedUser.password,
    })

    if (!isMatchedPasswords)
      return throwError({ msg: 'in-valid email or password', status: 400 })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: isExistedUser.email, type: OtpType.verifyDeactivation },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedOtp)
      return throwError({
        msg: 'code was already sent, check your e-mail or wait for 15m to request another code',
        status: 409,
      })

    await this.otpRepository.create({
      email: isExistedUser.email,
      type: OtpType.verifyDeactivation,
    })
  }

  static readonly deleteAccount = async (
    deleteAccountDTO: IDeleteAccountDTO,
  ) => {
    const { email, password } = deleteAccountDTO
    const isExistedUser = await this.userRepository.findOne({
      filter: { email },
      projection: { email: 1, password: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: 'in-valid email or password', status: 400 })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: isExistedUser.password,
    })

    if (!isMatchedPasswords)
      return throwError({ msg: 'in-valid email or password', status: 400 })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: isExistedUser.email, type: OtpType.verifyDeletion },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedOtp)
      return throwError({
        msg: 'code was already sent, check your e-mail or wait for 15m to request another code',
        status: 409,
      })

    await this.otpRepository.create({
      email: isExistedUser.email,
      type: OtpType.verifyDeletion,
    })
  }

  static readonly confirmDeletion = async (
    confirmDeletionDTO: IConfirmDeleteDTO,
  ) => {
    const { email, otpCode } = confirmDeletionDTO

    const isExistedOtp = await this.otpRepository.findOne({
      filter: {
        email,
        $or: [
          { type: OtpType.verifyDeletion },
          { type: OtpType.verifyDeactivation },
        ],
      },
    })

    if (!isExistedOtp)
      return throwError({ msg: 'code is expired', status: 400 })

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: isExistedOtp.otpCode,
    })

    if (!isMatchedOtp) return throwError({ msg: 'in-valid code', status: 400 })

    if (isExistedOtp.type == OtpType.verifyDeactivation) {
      await this.userRepository.findOneAndUpdate({
        filter: { $and: [{ email }, { deactivatedAt: { $exists: false } }] },
        data: { deactivatedAt: Date.now() },
      })
      return OtpType.verifyDeactivation
    }

    Promise.allSettled([
      this.userRepository.findOneAndDelete({
        filter: { email },
      }),

      isExistedOtp.deleteOne(),
    ])

    return OtpType.verifyDeletion
  }
}
