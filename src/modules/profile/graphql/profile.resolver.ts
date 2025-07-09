import { ProfileService } from '../profile.service'
import {
  IContext,
  ISuccessResponse,
} from '../../../common/decorators/graphql/types/IGraphQL.interface'
import {
  IChangeEmailDTO,
  IConfirmDeleteDTO,
  IConfirmNewEmailDTO,
  IDeleteAccountDTO,
  IUpdateProfileDTO,
} from '../dto/profile.dto'
import { OtpType } from '../../../db/models/enums/otp.enum'
import { throwError } from '../../../common/handlers/error-message.handler'

export class ProfileQueryResolver {
  protected static readonly ProfileService = ProfileService

  static readonly getProfile = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const profile = context.profile
    return {
      msg: 'done',
      status: 200,
      data: this.ProfileService.getProfile(profile),
    }
  }

  static readonly getFollowers = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const profile = context.profile
    return {
      msg: 'done',
      status: 200,
      data: this.ProfileService.getFollowers(profile),
    }
  }

  static readonly getFollowing = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const profile = context.profile
    return {
      msg: 'done',
      status: 200,
      data: this.ProfileService.getFollowing(profile),
    }
  }
}

export class ProfileMutationResolver {
  protected static readonly ProfileService = ProfileService

  static readonly updateProfile = async (
    args: IUpdateProfileDTO,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id } = context.profile
    const updateProfileDTO = args
    return {
      msg: 'Profile has has been updated successfully',
      status: 200,
      data: await this.ProfileService.updateProfile(_id, updateProfileDTO),
    }
  }

  static readonly deleteProfilePic = async (_: any, context: IContext) => {
    const { _id } = context.tokenPayload
    return {
      msg: 'Profile Picture has been deleted successfully',
      data: await this.ProfileService.deleteProfilePic(_id),
      status: 200,
    }
  }

  static readonly changeVisibility = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id } = context.tokenPayload
    await this.ProfileService.changeVisibility(_id)
    return {
      msg: 'Profile has has been updated successfully',
      status: 200,
    }
  }

  static readonly changeEmail = async (
    args: IChangeEmailDTO,
    context: IContext,
  ) => {
    const changeEmailDTO = args
    const { _id } = context.tokenPayload
    await this.ProfileService.changeEmail(_id, changeEmailDTO)
    return {
      msg: 'check your e-mail for verification',
      status: 200,
    }
  }
  static readonly confirmNewEmail = async (
    args: IConfirmNewEmailDTO,
    _: IContext,
  ) => {
    const confirmNewEmailDTO = args
    await this.ProfileService.confirmNewEmail(confirmNewEmailDTO)
    return {
      msg: 'your new e-mail has has been verified successfully',
      status: 200,
    }
  }

  static readonly deactivateAccount = async (
    args: IDeleteAccountDTO,
    _: IContext,
  ) => {
    const deleteAccountDTO = args
    await this.ProfileService.deactivateAccount(deleteAccountDTO)
    return {
      msg: 'check your e-mail to confirm',
      status: 200,
    }
  }

  static readonly deleteAccount = async (
    args: IDeleteAccountDTO,
    _: IContext,
  ) => {
    const deleteAccountDTO = args
    await this.ProfileService.deleteAccount(deleteAccountDTO)
    return {
      msg: 'check your e-mail to confirm',
      status: 200,
    }
  }

  static readonly confirmDeletion = async (
    args: IConfirmDeleteDTO,
    _: IContext,
  ) => {
    const confirmDeleteDTO = args
    const type = await this.ProfileService.confirmDeletion(confirmDeleteDTO)
    return {
      msg: `Account has has been ${type == OtpType.verifyDeletion ? 'deleted' : 'deactivated'} successfully`,
      status: 200,
    }
  }
}
