import { successResponse } from '../../common/utils/handlers/success-response.handler'
import { OtpType } from '../../../db/models/enums/otp.enum'
import { asyncHandler } from '../../common/decorators/async-handler.decorator'
import {
  IChangeEmailDTO,
  IConfirmDeleteDTO,
  IConfirmNewEmailDTO,
  IDeleteAccountDTO,
  IUpdateProfileDTO,
} from './dto/profile.DTO'
import { ProfileService } from './profile.service'

export class ProfileController {
  private static readonly ProfileService: typeof ProfileService = ProfileService

  static readonly updateProfilePic = asyncHandler(async (req, res) => {
    const { _id } = req.tokenPayload
    const path = req.file?.path!
    return successResponse(res, {
      msg: 'profile Picture been updated successfully',
      status: 200,
      data: await this.ProfileService.updateProfilePic(_id, path),
    })
  })

  static readonly deleteProfilePic = asyncHandler(async (req, res) => {
    const { _id } = req.tokenPayload
    await this.ProfileService.deleteProfilePic(_id)
    return successResponse(res, {
      msg: 'profile Picture been deleted successfully',
      status: 200,
    })
  })

  static readonly updateProfile = asyncHandler(async (req, res) => {
    const updateProfileDTO: IUpdateProfileDTO = req.body
    const { _id } = req.tokenPayload
    return successResponse(res, {
      msg: 'profile has been updated successfully',
      status: 200,
      data: await this.ProfileService.updateProfile(_id, updateProfileDTO),
    })
  })

  static readonly changeVisibility = asyncHandler(async (req, res) => {
    const { _id } = req.tokenPayload
    return successResponse(res, {
      msg: 'profile has been updated successfully',
      status: 200,
      data: await this.ProfileService.changeVisibility(_id),
    })
  })

  static readonly changeEmail = asyncHandler(async (req, res) => {
    const changeEmailDTO: IChangeEmailDTO = req.body
    const { _id } = req.tokenPayload
    await this.ProfileService.changeEmail(_id, changeEmailDTO)
    return successResponse(res, {
      msg: 'check your e-mail for verification',
      status: 200,
    })
  })

  static readonly confirmNewEmail = asyncHandler(async (req, res) => {
    const confirmNewEmailDTO: IConfirmNewEmailDTO = req.body
    await this.ProfileService.confirmNewEmail(confirmNewEmailDTO)
    return successResponse(res, {
      msg: 'your new e-mail has been verified successfully',
      status: 200,
    })
  })

  static readonly deactivateAccount = asyncHandler(async (req, res) => {
    const deleteAccountDTO: IDeleteAccountDTO = req.body
    await this.ProfileService.deactivateAccount(deleteAccountDTO)
    return successResponse(res, {
      msg: 'check your e-mail to confirm',
      status: 200,
    })
  })

  static readonly deleteAccount = asyncHandler(async (req, res) => {
    const deleteAccountDTO: IDeleteAccountDTO = req.body
    await this.ProfileService.deleteAccount(deleteAccountDTO)
    return successResponse(res, {
      msg: 'check your e-mail to confirm',
      status: 200,
    })
  })

  static readonly confirmDeleting = asyncHandler(async (req, res) => {
    const confirmDeleteDTO: IConfirmDeleteDTO = req.body
    const type = await this.ProfileService.confirmDeletion(confirmDeleteDTO)
    return successResponse(res, {
      msg: `Account has been ${type == OtpType.verifyDeletion ? 'deleted' : 'deactivated'} successfully`,
      status: 200,
    })
  })
}
