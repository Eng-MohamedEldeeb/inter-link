import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { OtpType } from '../../../db/models/enums/otp.enum'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import {
  IChangeEmailDTO,
  IConfirmDeleteDTO,
  IConfirmNewEmailDTO,
  IDeleteAccountDTO,
  IUpdateProfileDTO,
} from '../dto/profile.dto'
import { ProfileService } from '../profile.service'
import { PostService } from '../../post/post.service'
import { Response } from 'express'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { IUser } from '../../../db/interface/IUser.interface'
import { IGetAllDTO } from '../../post/dto/post.dto'

export class ProfileController {
  private static readonly ProfileService = ProfileService
  private static readonly PostService = PostService

  static readonly getProfile = asyncHandler((req: IRequest, res: Response) => {
    const profile: IUser = req.profile
    return successResponse(res, {
      data: this.ProfileService.getProfile(profile),
    })
  })

  static readonly getFollowers = asyncHandler(
    (req: IRequest, res: Response) => {
      const profile: IUser = req.profile
      return successResponse(res, {
        data: this.ProfileService.getFollowers(profile),
      })
    },
  )

  static readonly getFollowing = asyncHandler(
    (req: IRequest, res: Response) => {
      const profile: IUser = req.profile
      return successResponse(res, {
        data: this.ProfileService.getFollowing(profile),
      })
    },
  )

  static readonly getAllSavedPosts = asyncHandler(
    async (req: IRequest<null, IGetAllDTO>, res: Response) => {
      const { _id: profileId } = req.profile
      const query = req.query
      return successResponse(res, {
        data: await this.ProfileService.getAllSavedPosts({ profileId, query }),
      })
    },
  )

  static readonly changeAvatar = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId, avatar } = req.profile
      const path = req.file?.path!
      return successResponse(res, {
        msg: 'profile Picture has been updated successfully',
        data: await this.ProfileService.changeAvatar({
          profileId,
          avatar,
          path,
        }),
      })
    },
  )

  static readonly deleteProfilePic = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.tokenPayload
      return successResponse(res, {
        msg: 'profile Picture has been deleted successfully',
        data: await this.ProfileService.deleteProfilePic(_id),
      })
    },
  )

  static readonly updateProfile = asyncHandler(
    async (req: IRequest, res: Response) => {
      const updateProfileDTO: IUpdateProfileDTO = req.body
      const { _id } = req.tokenPayload
      return successResponse(res, {
        msg: 'profile has has been updated successfully',
        data: await this.ProfileService.updateProfile({
          profileId: _id,
          updateProfileDTO,
        }),
      })
    },
  )

  static readonly changeVisibility = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.tokenPayload
      await this.ProfileService.changeVisibility(_id)
      return successResponse(res, {
        msg: 'profile has has been updated successfully',
      })
    },
  )

  static readonly changeEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const changeEmailDTO: IChangeEmailDTO = req.body
      const { _id } = req.tokenPayload
      await this.ProfileService.changeEmail({ profileId: _id, changeEmailDTO })
      return successResponse(res, {
        msg: 'check your e-mail for verification',
      })
    },
  )

  static readonly confirmNewEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmNewEmailDTO: IConfirmNewEmailDTO = req.body
      await this.ProfileService.confirmNewEmail(confirmNewEmailDTO)
      return successResponse(res, {
        msg: 'your new e-mail has has been verified successfully',
      })
    },
  )

  static readonly deactivateAccount = asyncHandler(
    async (req: IRequest, res: Response) => {
      const deleteAccountDTO: IDeleteAccountDTO = req.body
      await this.ProfileService.deactivateAccount(deleteAccountDTO)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
      })
    },
  )

  static readonly deleteAccount = asyncHandler(
    async (req: IRequest, res: Response) => {
      const deleteAccountDTO: IDeleteAccountDTO = req.body
      await this.ProfileService.deleteAccount(deleteAccountDTO)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
      })
    },
  )

  static readonly confirmDeletion = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmDeleteDTO: IConfirmDeleteDTO = req.body
      const type = await this.ProfileService.confirmDeletion(confirmDeleteDTO)
      return successResponse(res, {
        msg: `Account has has been ${type == OtpType.verifyDeletion ? 'deleted' : 'deactivated'} successfully`,
      })
    },
  )
}
