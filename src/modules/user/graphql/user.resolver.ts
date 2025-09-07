import userService from "../user.service"

import {
  IContext,
  ISuccessResponse,
} from "../../../common/interface/IGraphQL.interface"

class UserQueryResolver {
  protected readonly userService = userService

  public readonly getUserProfile = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const { _id: profileId } = context.profile
    const user = context.user
    return {
      msg: "done",
      status: 200,
      data: this.userService.getUserProfile({ profileId, user }),
    }
  }

  public readonly getUseFollowers = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const userProfile = context.user
    return {
      msg: "done",
      status: 200,
      data: this.userService.getUseFollowers(userProfile),
    }
  }

  public readonly getUseFollowing = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const userProfile = context.user
    return {
      msg: "done",
      status: 200,
      data: this.userService.getUseFollowing(userProfile),
    }
  }
}

class UserMutationResolver {
  protected readonly userService = userService

  public readonly blockUser = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    const { _id: userId } = context.user
    return {
      msg: "done",
      status: 200,
      data: await this.userService.blockUser(profileId, userId),
    }
  }

  public readonly unblockUser = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId, blockedUsers } = context.profile
    const { _id: userId } = context.user
    return {
      msg: "done",
      status: 200,
      data: await this.userService.unblockUser({
        profileId,
        userId,
        blockedUsers,
      }),
    }
  }
}

export const userQueryResolver = new UserQueryResolver()
export const userMutationResolver = new UserMutationResolver()
