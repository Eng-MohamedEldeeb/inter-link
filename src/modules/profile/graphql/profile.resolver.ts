import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import { ProfileService } from '../profile.service'
import { OtpType } from '../../../db/models/enums/otp.enum'
import { IGetAll } from '../../post/dto/post.dto'
import { PostService } from '../../post/post.service'

import * as DTO from '../dto/profile.dto'

export class ProfileQueryResolver {
  protected static readonly ProfileService = ProfileService
  protected static readonly PostService = PostService

  public static readonly getProfile = (
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

  public static readonly getFollowers = (
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

  public static readonly getFollowing = (
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

  public static readonly getAllSavedPosts = async (
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

  public static readonly updateProfile = async (
    args: DTO.IUpdateProfile,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id } = context.profile
    const updateProfile = args
    return {
      msg: 'Profile has is updated successfully',
      status: 200,
      data: await this.ProfileService.updateProfile({
        profileId: _id,
        updateProfile,
      }),
    }
  }

  public static readonly deleteProfilePic = async (
    _: any,
    context: IContext,
  ) => {
    const { _id } = context.tokenPayload
    return {
      msg: 'Profile Picture is deleted successfully',
      data: await this.ProfileService.deleteProfilePic(_id),
      status: 200,
    }
  }

  public static readonly changeVisibility = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId, isPrivateProfile } = context.profile
    await this.ProfileService.changeVisibility({
      profileId,
      profileState: isPrivateProfile,
    })
    return {
      msg: 'Profile has is updated successfully',
      status: 200,
    }
  }

  public static readonly changeEmail = async (
    args: DTO.IChangeEmail,
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
  public static readonly confirmNewEmail = async (
    args: DTO.IConfirmNewEmail,
    _: IContext,
  ) => {
    const confirmNewEmail = args
    await this.ProfileService.confirmNewEmail(confirmNewEmail)
    return {
      msg: 'your new e-mail has is verified successfully',
      status: 200,
    }
  }

  public static readonly deactivateAccount = async (
    args: DTO.IDeleteAccount,
    _: IContext,
  ) => {
    const deleteAccount = args
    await this.ProfileService.deactivateAccount(deleteAccount)
    return {
      msg: 'check your e-mail to confirm',
      status: 200,
    }
  }

  public static readonly deleteAccount = async (
    args: DTO.IDeleteAccount,
    _: IContext,
  ) => {
    const deleteAccount = args
    await this.ProfileService.deleteAccount(deleteAccount)
    return {
      msg: 'check your e-mail to confirm',
      status: 200,
    }
  }

  public static readonly confirmDeletion = async (
    args: DTO.IConfirmDelete,
    _: IContext,
  ) => {
    const confirmDelete = args
    const type = await this.ProfileService.confirmDeletion(confirmDelete)
    return {
      msg: `Account has is ${type == OtpType.verifyDeletion ? 'deleted' : 'deactivated'} successfully`,
      status: 200,
    }
  }
}
