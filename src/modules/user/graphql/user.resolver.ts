import { UserService } from '../user.service'

import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

export class UserQueryResolver {
  protected static readonly UserService = UserService

  public static readonly getUserProfile = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const { _id: profileId } = context.profile
    const user = context.user
    return {
      msg: 'done',
      status: 200,
      data: this.UserService.getUserProfile({ profileId, user }),
    }
  }

  public static readonly getUseFollowers = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const userProfile = context.user
    return {
      msg: 'done',
      status: 200,
      data: this.UserService.getUseFollowers(userProfile),
    }
  }

  public static readonly getUseFollowing = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const userProfile = context.user
    return {
      msg: 'done',
      status: 200,
      data: this.UserService.getUseFollowing(userProfile),
    }
  }
}

export class UserMutationResolver {
  protected static readonly UserService = UserService

  public static readonly blockUser = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    const { _id: userId } = context.user
    return {
      msg: 'done',
      status: 200,
      data: await this.UserService.blockUser(profileId, userId),
    }
  }

  public static readonly unblockUser = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId, blockedUsers } = context.profile
    const { _id: userId } = context.user
    return {
      msg: 'done',
      status: 200,
      data: await this.UserService.unblockUser({
        profileId,
        userId,
        blockedUsers,
      }),
    }
  }
}
