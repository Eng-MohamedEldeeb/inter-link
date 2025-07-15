import { ProfileService } from '../profile.service'
import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'
import {
  IChangeEmail,
  IConfirmDelete,
  IConfirmNewEmail,
  IDeleteAccount,
  IUpdateProfile,
} from '../dto/profile.dto'
import { OtpType } from '../../../db/models/enums/otp.enum'
import { IGetAll } from '../../post/dto/post.dto'
import { PostService } from '../../post/post.service'

export class ProfileQueryResolver {
  protected static readonly ProfileService = ProfileService
  protected static readonly PostService = PostService

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

  static readonly getAllSavedPosts = async (
    args: IGetAll,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    return {
      msg: 'done',
      status: 200,
      data: await this.ProfileService.getAllSavedPosts({
        profileId,
        query: args,
      }),
    }
  }
}

export class ProfileMutationResolver {
  protected static readonly ProfileService = ProfileService

  static readonly updateProfile = async (
    args: IUpdateProfile,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id } = context.profile
    const updateProfile = args
    return {
      msg: 'Profile has has been updated successfully',
      status: 200,
      data: await this.ProfileService.updateProfile({
        profileId: _id,
        updateProfile,
      }),
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
    const { _id: profileId, isPrivateProfile } = context.profile
    await this.ProfileService.changeVisibility({
      profileId,
      profileState: isPrivateProfile,
    })
    return {
      msg: 'Profile has has been updated successfully',
      status: 200,
    }
  }

  static readonly changeEmail = async (
    args: IChangeEmail,
    context: IContext,
  ) => {
    const changeEmail = args
    const { _id } = context.tokenPayload
    await this.ProfileService.changeEmail({ profileId: _id, changeEmail })
    return {
      msg: 'check your e-mail for verification',
      status: 200,
    }
  }
  static readonly confirmNewEmail = async (
    args: IConfirmNewEmail,
    _: IContext,
  ) => {
    const confirmNewEmail = args
    await this.ProfileService.confirmNewEmail(confirmNewEmail)
    return {
      msg: 'your new e-mail has has been verified successfully',
      status: 200,
    }
  }

  static readonly deactivateAccount = async (
    args: IDeleteAccount,
    _: IContext,
  ) => {
    const deleteAccount = args
    await this.ProfileService.deactivateAccount(deleteAccount)
    return {
      msg: 'check your e-mail to confirm',
      status: 200,
    }
  }

  static readonly deleteAccount = async (args: IDeleteAccount, _: IContext) => {
    const deleteAccount = args
    await this.ProfileService.deleteAccount(deleteAccount)
    return {
      msg: 'check your e-mail to confirm',
      status: 200,
    }
  }

  static readonly confirmDeletion = async (
    args: IConfirmDelete,
    _: IContext,
  ) => {
    const confirmDelete = args
    const type = await this.ProfileService.confirmDeletion(confirmDelete)
    return {
      msg: `Account has has been ${type == OtpType.verifyDeletion ? 'deleted' : 'deactivated'} successfully`,
      status: 200,
    }
  }
}
