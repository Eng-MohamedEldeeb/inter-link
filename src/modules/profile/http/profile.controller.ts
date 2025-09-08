import profileService from "../profile.service"

import * as DTO from "../dto/profile.dto"

import { successResponse } from "../../../common/handlers/success-response.handler"
import { OtpType } from "../../../db/models/enums/otp.enum"
import { asyncHandler } from "../../../common/decorators/async-handler/async-handler.decorator"
import { Response } from "express"
import { IRequest } from "../../../common/interface/IRequest.interface"
import { IUser } from "../../../db/interfaces/IUser.interface"
import { IGetAll } from "../../post/dto/post.dto"

class ProfileController {
  private readonly profileService = profileService

  public readonly getProfile = asyncHandler((req: IRequest, res: Response) => {
    const profile: IUser = req.profile
    return successResponse(res, {
      data: this.profileService.getProfile(profile),
    })
  })

  public readonly getFollowers = asyncHandler(
    (req: IRequest, res: Response) => {
      const profile: IUser = req.profile
      return successResponse(res, {
        data: this.profileService.getFollowers(profile),
      })
    },
  )

  public readonly getFollowing = asyncHandler(
    (req: IRequest, res: Response) => {
      const profile: IUser = req.profile
      return successResponse(res, {
        data: this.profileService.getFollowing(profile),
      })
    },
  )

  public readonly getAllSavedPosts = asyncHandler(
    async (req: IRequest<null, IGetAll>, res: Response) => {
      const { _id: profileId } = req.profile
      const query = req.query
      return successResponse(res, {
        data: await this.profileService.getAllSavedPosts({ profileId, query }),
      })
    },
  )

  public readonly changeAvatar = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId, avatar } = req.profile
      const path = req.file!.path!
      return successResponse(res, {
        msg: "profile Picture is updated successfully",
        data: await this.profileService.changeAvatar({
          profileId,
          avatar,
          path,
        }),
      })
    },
  )

  public readonly deleteProfilePic = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.tokenPayload
      return successResponse(res, {
        msg: "profile Picture is deleted successfully",
        data: await this.profileService.deleteProfilePic(_id),
      })
    },
  )

  public readonly updateProfile = asyncHandler(
    async (req: IRequest, res: Response) => {
      const updateProfile: DTO.IUpdateProfile = req.body
      const { _id } = req.tokenPayload
      return successResponse(res, {
        msg: "profile has is updated successfully",
        data: await this.profileService.updateProfile({
          profileId: _id,
          updateProfile,
        }),
      })
    },
  )

  public readonly changeVisibility = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId, isPrivateProfile } = req.profile
      await this.profileService.changeVisibility({
        profileId,
        profileState: isPrivateProfile,
      })
      return successResponse(res, {
        msg: "Profile Visibility is updated successfully",
      })
    },
  )

  public readonly changeEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const changeEmail: DTO.IChangeEmail = req.body
      const { _id } = req.tokenPayload
      await this.profileService.changeEmail({ profileId: _id, changeEmail })
      return successResponse(res, {
        msg: "check your e-mail for verification",
      })
    },
  )

  public readonly confirmNewEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmNewEmail: DTO.IConfirmNewEmail = req.body
      await this.profileService.confirmNewEmail(confirmNewEmail)
      return successResponse(res, {
        msg: "your new e-mail has is verified successfully",
      })
    },
  )

  public readonly deactivateAccount = asyncHandler(
    async (req: IRequest, res: Response) => {
      const deleteAccount: DTO.IDeleteAccount = req.body
      await this.profileService.deactivateAccount(deleteAccount)
      return successResponse(res, {
        msg: "check your e-mail to confirm",
      })
    },
  )

  public readonly deleteAccount = asyncHandler(
    async (req: IRequest, res: Response) => {
      const deleteAccount: DTO.IDeleteAccount = req.body
      await this.profileService.deleteAccount(deleteAccount)
      return successResponse(res, {
        msg: "check your e-mail to confirm",
      })
    },
  )

  public readonly confirmDeletion = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmDelete: DTO.IConfirmDelete = req.body
      const type = await this.profileService.confirmDeletion(confirmDelete)
      return successResponse(res, {
        msg: `Account has is ${type == OtpType.verifyDeletion ? "deleted" : "deactivated"} successfully`,
      })
    },
  )
}

export default new ProfileController()
