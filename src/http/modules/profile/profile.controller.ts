import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { OtpType } from '../../../db/models/enums/otp.enum'
import { asyncHandler } from '../../../common/decorators/async-handler.decorator'
import {
  IChangeEmailDTO,
  IConfirmDeleteDTO,
  IConfirmNewEmailDTO,
  IDeleteAccountDTO,
  IUpdateProfileDTO,
} from './dto/profile.dto'
import { ProfileService } from './profile.service'
import { Response } from 'express'
import { IRequest } from '../../../common/interface/http/IRequest.interface'
import { IUser } from '../../../db/models/interfaces/IUser.interface'

export class ProfileController {
  private static readonly ProfileService: typeof ProfileService = ProfileService

  static readonly get = asyncHandler(async (req: IRequest, res: Response) => {
    const profile: IUser = req.profile
    return successResponse(res, {
      msg: 'profile Picture been updated successfully',
      status: 200,
      data: this.ProfileService.get(profile),
    })
  })

  static readonly updateProfilePic = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.tokenPayload
      // const path = req.file?.path!

      console.log({ file: req.file })

      return successResponse(res, {
        msg: 'profile Picture been updated successfully',
        status: 200,
        // data: await this.ProfileService.updateProfilePic(_id, path),
      })
    },
  )

  static readonly deleteProfilePic = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.tokenPayload
      await this.ProfileService.deleteProfilePic(_id)
      return successResponse(res, {
        msg: 'profile Picture been deleted successfully',
        status: 200,
      })
    },
  )

  static readonly updateProfile = asyncHandler(
    async (req: IRequest, res: Response) => {
      const updateProfileDTO: IUpdateProfileDTO = req.body
      const { _id } = req.tokenPayload
      return successResponse(res, {
        msg: 'profile has been updated successfully',
        status: 200,
        data: await this.ProfileService.updateProfile(_id, updateProfileDTO),
      })
    },
  )

  static readonly changeVisibility = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.tokenPayload
      return successResponse(res, {
        msg: 'profile has been updated successfully',
        status: 200,
        data: await this.ProfileService.changeVisibility(_id),
      })
    },
  )

  static readonly changeEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const changeEmailDTO: IChangeEmailDTO = req.body
      const { _id } = req.tokenPayload
      await this.ProfileService.changeEmail(_id, changeEmailDTO)
      return successResponse(res, {
        msg: 'check your e-mail for verification',
        status: 200,
      })
    },
  )

  static readonly confirmNewEmail = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmNewEmailDTO: IConfirmNewEmailDTO = req.body
      await this.ProfileService.confirmNewEmail(confirmNewEmailDTO)
      return successResponse(res, {
        msg: 'your new e-mail has been verified successfully',
        status: 200,
      })
    },
  )

  static readonly deactivateAccount = asyncHandler(
    async (req: IRequest, res: Response) => {
      const deleteAccountDTO: IDeleteAccountDTO = req.body
      await this.ProfileService.deactivateAccount(deleteAccountDTO)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
        status: 200,
      })
    },
  )

  static readonly deleteAccount = asyncHandler(
    async (req: IRequest, res: Response) => {
      const deleteAccountDTO: IDeleteAccountDTO = req.body
      await this.ProfileService.deleteAccount(deleteAccountDTO)
      return successResponse(res, {
        msg: 'check your e-mail to confirm',
        status: 200,
      })
    },
  )

  static readonly confirmDeleting = asyncHandler(
    async (req: IRequest, res: Response) => {
      const confirmDeleteDTO: IConfirmDeleteDTO = req.body
      const type = await this.ProfileService.confirmDeletion(confirmDeleteDTO)
      return successResponse(res, {
        msg: `Account has been ${type == OtpType.verifyDeletion ? 'deleted' : 'deactivated'} successfully`,
        status: 200,
      })
    },
  )
}
