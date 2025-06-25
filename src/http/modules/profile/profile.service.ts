import { Types } from 'mongoose'
import otpRepository from '../../../common/repositories/otp.repository'
import userRepository from '../../../common/repositories/user.repository'
import { throwHttpError } from '../../common/utils/handlers/error-message.handler'
import { compareValues } from '../../../common/utils/security/bcrypt/bcrypt.service'
import { OtpType } from '../../../db/models/enums/otp.enum'
import {
  IChangeEmailDTO,
  IConfirmDeleteDTO,
  IConfirmNewEmailDTO,
  IDeleteAccountDTO,
  IUpdateProfileDTO,
} from './dto/profile.DTO'
import { ICloud } from '../../common/services/upload/interface/cloud-response.interface'
import { CloudUploader } from '../../common/services/upload/cloud.service'

export class ProfileService {
  private static readonly userRepository = userRepository
  private static readonly otpRepository = otpRepository
  private static readonly CloudUploader = CloudUploader

  static readonly updateProfilePic = async (
    userId: Types.ObjectId,
    path: string,
  ) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: { _id: userId, deactivatedAt: { $exists: false } },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwHttpError({ msg: "user doesn't exist", status: 404 })

    if (
      isExistedUser.avatar.secure_url != process.env.DEFAULT_PROFILE_AVATAR_PIC
    ) {
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
      options: { new: true, lean: true, projection: { avatar: 1 } },
    })
  }

  static readonly deleteProfilePic = async (userId: Types.ObjectId) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: { _id: userId, deactivatedAt: { $exists: false } },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwHttpError({ msg: "user doesn't exist", status: 404 })

    return await this.userRepository.findByIdAndUpdate({
      _id: userId,
      data: {
        $unset: { avatar: 1 },
      },
      options: { new: true, lean: true },
    })
  }

  static readonly updateProfile = async (
    userId: Types.ObjectId,
    updateProfileDTO: IUpdateProfileDTO,
  ) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: {
        _id: userId,
        deactivatedAt: { $exists: false },
      },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwHttpError({ msg: "user doesn't exist", status: 404 })

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

  static readonly changeVisibility = async (userId: Types.ObjectId) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: {
        _id: userId,
        deactivatedAt: { $exists: false },
      },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwHttpError({ msg: "user doesn't exist", status: 404 })

    return await this.userRepository.findByIdAndUpdate({
      _id: userId,
      data: { isPrivateProfile: !Boolean(isExistedUser.isPrivateProfile) },
      options: {
        lean: true,
        new: true,
        projection: { isPrivateProfile: 1 },
      },
    })
  }

  static readonly changeEmail = async (
    userId: Types.ObjectId,
    changeEmailDTO: IChangeEmailDTO,
  ) => {
    const { newEmail, password } = changeEmailDTO

    const isExistedUser = await this.userRepository.findOne({
      filter: {
        _id: userId,
        deactivatedAt: { $exists: false },
      },
      projection: { password: 1 },
    })

    if (!isExistedUser)
      return throwHttpError({ msg: "user doesn't exist", status: 404 })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: isExistedUser.password,
    })

    if (!isMatchedPasswords)
      return throwHttpError({ msg: 'in-valid password', status: 400 })

    const conflictedEmail = await this.userRepository.findOne({
      filter: {
        email: newEmail,
      },
      projection: { _id: 1 },
    })

    if (conflictedEmail)
      return throwHttpError({ msg: 'e-mail already exists', status: 409 })

    await this.userRepository.findByIdAndUpdate({
      _id: isExistedUser._id,
      data: { tempEmail: newEmail },
    })
  }

  static readonly confirmNewEmail = async (
    confirmEmailDTO: IConfirmNewEmailDTO,
  ) => {
    const { email, otpCode } = confirmEmailDTO

    const isExistedUser = await this.userRepository.findOne({
      filter: { email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwHttpError({ msg: "user doesn't exist", status: 409 })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (!isExistedOtp)
      return throwHttpError({
        msg: 'expired verification code',
        status: 400,
      })

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: isExistedOtp.otpCode,
    })

    if (!isMatchedOtp)
      return throwHttpError({
        msg: 'in-valid verification code',
        status: 400,
      })

    await this.userRepository.findOneAndUpdate({
      filter: { email, deactivatedAt: { $exists: false } },
      data: { email: isExistedUser.tempEmail, $unset: { tempEmail: 1 } },
      options: { lean: true, new: true, projection: 'email' },
    })
  }

  static readonly deactivateAccount = async (
    deleteAccountDTO: IDeleteAccountDTO,
  ) => {
    const { email, password } = deleteAccountDTO
    const isExistedUser = await this.userRepository.findOne({
      filter: { email, deactivatedAt: { $exists: false } },
      projection: { email: 1, password: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwHttpError({ msg: 'in-valid email or password', status: 400 })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: isExistedUser.password,
    })

    if (!isMatchedPasswords)
      return throwHttpError({ msg: 'in-valid email or password', status: 400 })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: isExistedUser.email, type: OtpType.verifyDeactivation },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedOtp)
      return throwHttpError({
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
      return throwHttpError({ msg: 'in-valid email or password', status: 400 })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: isExistedUser.password,
    })

    if (!isMatchedPasswords)
      return throwHttpError({ msg: 'in-valid email or password', status: 400 })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: isExistedUser.email, type: OtpType.verifyDeletion },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedOtp)
      return throwHttpError({
        msg: 'code was already sent, check your e-mail or wait for 15m to request another code',
        status: 409,
      })

    await this.otpRepository.create({
      email: isExistedUser.email,
      type: OtpType.verifyDeletion,
    })
  }

  static readonly confirmDeletion = async (
    confirmDeletingDTO: IConfirmDeleteDTO,
  ) => {
    const { email, otpCode } = confirmDeletingDTO

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
      return throwHttpError({ msg: 'code is expired', status: 400 })

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: isExistedOtp.otpCode,
    })

    if (!isMatchedOtp)
      return throwHttpError({ msg: 'in-valid code', status: 400 })

    if (isExistedOtp.type == OtpType.verifyDeactivation) {
      await this.userRepository.findOneAndUpdate({
        filter: { email, deactivatedAt: { $exists: false } },
        data: { deactivatedAt: Date.now() },
        options: { lean: true, new: true },
      })
      return OtpType.verifyDeactivation
    }

    await this.userRepository.findOneAndDelete({
      filter: { email },
    })

    return OtpType.verifyDeletion
  }
}
