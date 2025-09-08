import {
  otpRepository,
  postRepository,
  userRepository,
} from "../../common/repositories"

import * as DTO from "./dto/profile.dto"

import { throwError } from "../../common/handlers/error-message.handler"
import { compareValues } from "../../common/utils/security/bcrypt/bcrypt.service"
import { decryptValue } from "../../common/utils/security/crypto/crypto.service"
import { OtpType } from "../../db/models/enums/otp.enum"
import { IGetAll } from "../post/dto/post.dto"
import { IUser } from "../../db/interfaces/IUser.interface"
import { MongoId } from "../../common/types/db"
import { CloudUploader } from "../../common/services/upload/cloud.service"
import { ICloud } from "../../common/services/upload/interface/cloud-response.interface"

class ProfileService {
  private readonly userRepository = userRepository
  private readonly postRepository = postRepository
  private readonly otpRepository = otpRepository
  private readonly CloudUploader = CloudUploader

  public readonly getProfile = (profile: IUser) => {
    if (profile.phone)
      profile.phone = decryptValue({ encryptedValue: profile.phone })

    return profile
  }

  public readonly getFollowers = (profile: IUser) => {
    return {
      followers: profile.followers,
    }
  }

  public readonly getFollowing = (profile: IUser) => {
    return {
      following: profile.following,
    }
  }

  public readonly getAllSavedPosts = async ({
    profileId,
    query,
  }: {
    profileId: MongoId
    query: IGetAll
  }) => {
    const { page, limit } = query

    const skip = (page ?? 1 - 1) * limit

    const limitQuery = limit ?? 10

    const posts = await this.postRepository.find({
      filter: {
        $and: [{ archivedAt: { $exists: false } }, { savedBy: profileId }],
      },
      options: { sort: { createdAt: -1 }, projection: { saves: 0 } },
      skip,
      limit: limitQuery,
    })

    return {
      posts,
      count: posts.length,
      page: Math.ceil(posts.length / limitQuery),
    }
  }

  public readonly changeAvatar = async ({
    profileId,
    avatar,
    path,
  }: {
    profileId: MongoId
    avatar: ICloud
    path: string
  }) => {
    const hasDefaultAvatar = avatar.secure_url == process.env.DEFAULT_PIC

    if (!hasDefaultAvatar) {
      const { secure_url, public_id } = await this.CloudUploader.upload({
        path,
        public_id: avatar.public_id,
      })

      return await this.userRepository.findByIdAndUpdate({
        _id: profileId,
        data: {
          avatar: { secure_url, public_id },
        },
        options: { new: true, lean: true, projection: { avatar: 1 } },
      })
    }

    const { secure_url, public_id } = await this.CloudUploader.upload({
      path,
      folderName: `${process.env.APP_NAME}/${profileId.toString()}/avatar`,
    })

    return await this.userRepository.findByIdAndUpdate({
      _id: profileId,
      data: {
        avatar: { secure_url, public_id },
      },
      options: {
        new: true,
        lean: true,
        projection: { "avatar.secure_url": 1 },
      },
    })
  }

  public readonly deleteProfilePic = async (userId: MongoId) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: { _id: userId, deactivatedAt: { $exists: false } },
      projection: { _id: 1, avatar: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: "user doesn't exist", status: 404 })

    const hasDefaultAvatar =
      isExistedUser.avatar.secure_url == process.env.DEFAULT_PIC

    if (hasDefaultAvatar)
      return throwError({
        msg: "user already doesn't have a profile avatar",
        status: 400,
      })

    await this.CloudUploader.deleteAsset(isExistedUser.avatar.public_id)

    return await this.userRepository.findByIdAndUpdate({
      _id: userId,
      data: {
        $set: {
          avatar: { secure_url: process.env.DEFAULT_PIC },
        },
      },
      options: {
        new: true,
        lean: true,
        projection: { "avatar.secure_url": 1 },
      },
    })
  }

  public readonly updateProfile = async ({
    profileId,
    updateProfile,
  }: {
    profileId: MongoId
    updateProfile: DTO.IUpdateProfile
  }) => {
    const { username } = updateProfile
    const isExistedUser = await this.userRepository.findOne({
      filter: {
        _id: profileId,
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
      return throwError({ msg: "username is taken", status: 409 })

    return await this.userRepository.findByIdAndUpdate({
      _id: profileId,
      data: updateProfile,
      options: {
        lean: true,
        new: true,
        projection: Object.keys(updateProfile).join(" "),
      },
    })
  }

  public readonly changeVisibility = async ({
    profileId,
    profileState,
  }: {
    profileId: MongoId
    profileState: boolean
  }) => {
    return await this.userRepository.findByIdAndUpdate({
      _id: profileId,
      data: { isPrivateProfile: !profileState },
      options: {
        lean: true,
        new: true,
        projection: { isPrivateProfile: 1 },
      },
    })
  }

  public readonly changeEmail = async ({
    profileId,
    changeEmail,
  }: {
    profileId: MongoId
    changeEmail: DTO.IChangeEmail
  }) => {
    const { originalEmail, newEmail, password } = changeEmail

    const isExistedUser = await this.userRepository.findOne({
      filter: {
        $and: [
          { _id: profileId },
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
      return throwError({ msg: "Invalid password", status: 400 })

    const conflictedEmail = await this.userRepository.findOne({
      filter: {
        email: newEmail,
      },
      projection: { _id: 1 },
    })

    if (conflictedEmail)
      return throwError({ msg: "e-mail already exists", status: 409 })

    Promise.allSettled([
      otpRepository.create({
        email: originalEmail,
        type: OtpType.confirmNewEmail,
      }),
      isExistedUser.updateOne({ tempEmail: newEmail }),
    ])
  }

  public readonly confirmNewEmail = async (
    confirmEmail: DTO.IConfirmNewEmail,
  ) => {
    const { originalEmail, otpCode } = confirmEmail

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
        msg: "expired verification code",
        status: 400,
      })

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: isExistedOtp.otpCode,
    })

    if (!isMatchedOtp)
      return throwError({
        msg: "Invalid verification code",
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

  public readonly deactivateAccount = async (
    deleteAccount: DTO.IDeleteAccount,
  ) => {
    const { email, password } = deleteAccount
    const isExistedUser = await this.userRepository.findOne({
      filter: { $and: [{ email }, { deactivatedAt: { $exists: false } }] },
      projection: { email: 1, password: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: "Invalid email or password", status: 400 })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: isExistedUser.password,
    })

    if (!isMatchedPasswords)
      return throwError({ msg: "Invalid email or password", status: 400 })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: isExistedUser.email, type: OtpType.verifyDeactivation },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedOtp)
      return throwError({
        msg: "code was already sent, check your e-mail or wait for 15m to request another code",
        status: 409,
      })

    await this.otpRepository.create({
      email: isExistedUser.email,
      type: OtpType.verifyDeactivation,
    })
  }

  public readonly deleteAccount = async (deleteAccount: DTO.IDeleteAccount) => {
    const { email, password } = deleteAccount
    const isExistedUser = await this.userRepository.findOne({
      filter: { email },
      projection: { email: 1, password: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: "Invalid email or password", status: 400 })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: isExistedUser.password,
    })

    if (!isMatchedPasswords)
      return throwError({ msg: "Invalid email or password", status: 400 })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: isExistedUser.email, type: OtpType.verifyDeletion },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedOtp)
      return throwError({
        msg: "code was already sent, check your e-mail or wait for 15m to request another code",
        status: 409,
      })

    await this.otpRepository.create({
      email: isExistedUser.email,
      type: OtpType.verifyDeletion,
    })
  }

  public readonly confirmDeletion = async (
    confirmDeletion: DTO.IConfirmDelete,
  ) => {
    const { email, otpCode } = confirmDeletion

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
      return throwError({ msg: "code is expired", status: 400 })

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: isExistedOtp.otpCode,
    })

    if (!isMatchedOtp) return throwError({ msg: "Invalid code", status: 400 })

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

export default new ProfileService()
