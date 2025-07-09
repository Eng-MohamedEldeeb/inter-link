import { UserService } from '../user.service'
import {
  IContext,
  ISuccessResponse,
} from '../../../common/decorators/graphql/types/IGraphQL.interface'
import { IUser } from '../../../db/interface/IUser.interface'

export class UserQueryResolver {
  protected static readonly UserService = UserService

  static readonly getUserProfile = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const userProfile = context.user
    return {
      msg: 'done',
      status: 200,
      data: this.UserService.getUserProfile(userProfile),
    }
  }

  static readonly getUseFollowers = (
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

  static readonly getUseFollowing = (
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

  static readonly blockUser = async (
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

  static readonly unblockUser = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId, blockedUsers } = context.profile
    const { _id: userId } = context.user
    return {
      msg: 'done',
      status: 200,
      data: await this.UserService.unblockUser(profileId, userId, blockedUsers),
    }
  }
}
