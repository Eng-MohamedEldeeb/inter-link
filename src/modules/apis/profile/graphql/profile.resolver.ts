import {
  IContext,
  ISuccessResponse,
} from "../../../../common/interface/IGraphQL.interface"

import { OtpType } from "../../../../db/models/enums/otp.enum"
import { IGetAll } from "../../post/dto/post.dto"

import postService from "../../post/post.service"
import profileService from "../profile.service"

import * as DTO from "../dto/profile.dto"

class ProfileQueryResolver {
  private readonly profileService = profileService
  private readonly postService = postService

  public readonly getProfile = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const profile = context.profile
    return {
      msg: "done",
      status: 200,
      data: this.profileService.getProfile(profile),
    }
  }

  public readonly getFollowers = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const profile = context.profile
    return {
      msg: "done",
      status: 200,
      data: this.profileService.getFollowers(profile),
    }
  }

  public readonly getFollowing = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const profile = context.profile
    return {
      msg: "done",
      status: 200,
      data: this.profileService.getFollowing(profile),
    }
  }

  public readonly getAllSavedPosts = async (
    args: IGetAll,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    return {
      msg: "done",
      status: 200,
      data: await this.profileService.getAllSavedPosts({
        profileId,
        query: args,
      }),
    }
  }
}

class ProfileMutationResolver {
  private readonly profileService = profileService

  public readonly updateProfile = async (
    args: DTO.IUpdateProfile,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id } = context.profile
    const updateProfile = args
    return {
      msg: "Profile has is updated successfully",
      status: 200,
      data: await this.profileService.updateProfile({
        profileId: _id,
        updateProfile,
      }),
    }
  }

  public readonly deleteProfilePic = async (_: any, context: IContext) => {
    const { _id } = context.tokenPayload
    return {
      msg: "Profile Picture is deleted successfully",
      data: await this.profileService.deleteProfilePic(_id),
      status: 200,
    }
  }

  public readonly changeVisibility = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId, isPrivateProfile } = context.profile
    await this.profileService.changeVisibility({
      profileId,
      profileState: isPrivateProfile,
    })
    return {
      msg: "Profile has is updated successfully",
      status: 200,
    }
  }

  public readonly changeEmail = async (
    args: DTO.IChangeEmail,
    context: IContext,
  ) => {
    const changeEmail = args
    const { _id } = context.tokenPayload
    await this.profileService.changeEmail({ profileId: _id, changeEmail })
    return {
      msg: "check your e-mail for verification",
      status: 200,
    }
  }
  public readonly confirmNewEmail = async (
    args: DTO.IConfirmNewEmail,
    _: IContext,
  ) => {
    const confirmNewEmail = args
    await this.profileService.confirmNewEmail(confirmNewEmail)
    return {
      msg: "your new e-mail has is verified successfully",
      status: 200,
    }
  }

  public readonly deactivateAccount = async (
    args: DTO.IDeleteAccount,
    _: IContext,
  ) => {
    const deleteAccount = args
    await this.profileService.deactivateAccount(deleteAccount)
    return {
      msg: "check your e-mail to confirm",
      status: 200,
    }
  }

  public readonly deleteAccount = async (
    args: DTO.IDeleteAccount,
    _: IContext,
  ) => {
    const deleteAccount = args
    await this.profileService.deleteAccount(deleteAccount)
    return {
      msg: "check your e-mail to confirm",
      status: 200,
    }
  }

  public readonly confirmDeletion = async (
    args: DTO.IConfirmDelete,
    _: IContext,
  ) => {
    const confirmDelete = args
    const type = await this.profileService.confirmDeletion(confirmDelete)
    return {
      msg: `Account has is ${type == OtpType.verifyDeletion ? "deleted" : "deactivated"} successfully`,
      status: 200,
    }
  }
}

export const profileQueryResolver = new ProfileQueryResolver()
export const profileMutationResolver = new ProfileMutationResolver()
