import { successResponse } from '../../../common/handlers/success-response.handler'
import { OtpType } from '../../../db/models/enums/otp.enum'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { ProfileService } from '../profile.service'
import { Response } from 'express'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { IUser } from '../../../db/interfaces/IUser.interface'
import { IGetAll } from '../../post/dto/post.dto'

import * as DTO from '../dto/profile.dto'

export class ProfileController {
  private static readonly ProfileService = ProfileService

  public static readonly getProfile = asyncHandler(
    (req: IRequest, res: Response) => {
      const profile: IUser = req.profile
      return successResponse(res, {
        data: this.ProfileService.getProfile(profile),
      })
    },
  )

  public static readonly getFollowers = asyncHandler(
    (req: IRequest, res: Response) => {
      const profile: IUser = req.profile
      return successResponse(res, {
        data: this.ProfileService.getFollowers(profile),
      })
    },
  )

  public static readonly getFollowing = asyncHandler(
    (req: IRequest, res: Response) => {
      const profile: IUser = req.profile
      return successResponse(res, {
        data: this.ProfileService.getFollowing(profile),
      })
    },
  )

  public static readonly getAllSavedPosts = asyncHandler(
    async (req: IRequest<null, IGetAll>, res: Response) => {
      const { _id: profileId } = req.profile
      const query = req.query
      return successResponse(res, {
        data: await this.ProfileService.getAllSavedPosts({ profileId, query }),
      })
    },
  )

  public static readonly changeAvatar = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId, avatar } = req.profile
      const path = req.file!.path!
      return successResponse(res, {
        msg: 'profile Picture is updated successfully',
        data: await this.ProfileService.changeAvatar({
          profileId,
          avatar,
          path,
        }),
      })
    },
  )

  public static readonly deleteProfilePic = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.tokenPayload
      return successResponse(res, {
        msg: 'profile Picture is deleted successfully',
        data: await this.ProfileService.deleteProfilePic(_id),
      })
    },
  )

  public static readonly updateProfile = asyncHandler(
    async (req: IRequest, res: Response) => {
      const updateProfile: DTO.IUpdateProfile = req.body
      const { _id } = req.tokenPayload
      return successResponse(res, {
        msg: 'profile has is updated successfully',
        data: await this.ProfileService.updateProfile({
          profileId: _id,
          updateProfile,
        }),
      })
    },
  )

  public static readonly changeVisibility = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId, isPrivateProfile } = req.profile
      await this.ProfileService.changeVisibility({
        profileId,
        profileState: isPrivateProfile,
      })
      return successResponse(res, {
        msg: 'Profile Visibility is updated successfully',
      })
    },
  )

  public static readonly changeEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const changeEmail: DTO.IChangeEmail = req.body
      const { _id } = req.tokenPayload
      await this.ProfileService.changeEmail({ profileId: _id, changeEmail })
      return successResponse(res, {
        msg: 'check your e-mail for verification',
      })
    },
  )

  public static readonly confirmNewEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmNewEmail: DTO.IConfirmNewEmail = req.body
      await this.ProfileService.confirmNewEmail(confirmNewEmail)
      return successResponse(res, {
        msg: 'your new e-mail has is verified successfully',
      })
    },
  )

  public static readonly deactivateAccount = asyncHandler(
    async (req: IRequest, res: Response) => {
      const deleteAccount: DTO.IDeleteAccount = req.body
      await this.ProfileService.deactivateAccount(deleteAccount)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
      })
    },
  )

  public static readonly deleteAccount = asyncHandler(
    async (req: IRequest, res: Response) => {
      const deleteAccount: DTO.IDeleteAccount = req.body
      await this.ProfileService.deleteAccount(deleteAccount)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
      })
    },
  )

  public static readonly confirmDeletion = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmDelete: DTO.IConfirmDelete = req.body
      const type = await this.ProfileService.confirmDeletion(confirmDelete)
      return successResponse(res, {
        msg: `Account has is ${type == OtpType.verifyDeletion ? 'deleted' : 'deactivated'} successfully`,
      })
    },
  )
}
