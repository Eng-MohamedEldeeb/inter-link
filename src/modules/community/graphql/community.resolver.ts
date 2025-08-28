import { CommunityService } from '../community.service'
import { PostService } from '../../post/post.service'
import { ICreateCommunity, IEditCommunity } from '../dto/community.dto'

import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

export class CommunityQueryResolver {
  private static readonly CommunityService = CommunityService

  public static readonly getAllCommunities = async (
    _: any,
    __: any,
  ): Promise<ISuccessResponse> => {
    return {
      msg: 'done',
      status: 200,
      data: await this.CommunityService.getAllCommunities(),
    }
  }

  public static readonly getCommunity = (
    _: null,
    context: IContext,
  ): ISuccessResponse => {
    const { _id: profileId } = context.profile
    const { community } = context

    return {
      msg: 'done',
      status: 200,
      data: this.CommunityService.getCommunity({ profileId, community }),
    }
  }

  public static readonly getCommunityMembers = (
    _: null,
    context: IContext,
  ): ISuccessResponse => {
    const { _id: profileId } = context.profile
    const { community } = context

    return {
      msg: 'done',
      status: 200,
      data: this.CommunityService.getCommunityMembers({ profileId, community }),
    }
  }
}

export class CommunityMutationResolver {
  private static readonly CommunityService = CommunityService
  private static readonly PostService = PostService

  public static readonly create = async (
    args: ICreateCommunity,
    context: IContext,
  ) => {
    const { _id: profileId } = context.profile

    return {
      status: 201,
      msg: 'Community is created Successfully',
      data: await this.CommunityService.create({
        createdBy: profileId,
        createCommunityDTO: args,
      }),
    }
  }

  public static readonly edit = async (
    args: IEditCommunity,
    context: IContext,
  ) => {
    const { _id: communityId } = context.community
    return {
      msg: 'Community is modified successfully',
      status: 200,
      data: await this.CommunityService.editCommunity({
        communityId,
        editCommunity: args,
      }),
    }
  }

  public static readonly changeVisibility = async (
    args: IEditCommunity,
    context: IContext,
  ) => {
    const { _id: communityId, isPrivateCommunity } = context.community

    await this.CommunityService.changeVisibility({
      communityId,
      state: isPrivateCommunity,
    })

    return {
      msg: 'Community Visibility is Changed successfully',
      status: 200,
    }
  }

  public static readonly deleteCommunity = async (
    _: any,
    context: IContext,
  ) => {
    const { _id: communityId } = context.community

    await this.CommunityService.deleteCommunity(communityId)

    return {
      msg: 'Community is deleted successfully',
      status: 200,
    }
  }

  public static readonly removePostFromCommunity = async (
    _: any,
    context: IContext,
  ) => {
    const { _id: communityId, name } = context.community
    const { _id: postId } = context.post

    await this.PostService.removeFromCommunity({ communityId, postId })

    return {
      msg: `Post is deleted from ${name} Community Successfully`,
      status: 200,
    }
  }

  public static readonly addAdmin = async (_: any, context: IContext) => {
    const { _id: communityId } = context.community
    const { _id: userId, username } = context.user

    return {
      msg: `User '${username}' is now a Community Admin`,
      status: 200,
      data: await this.CommunityService.addAdmin({ communityId, userId }),
    }
  }

  public static readonly removeAdmin = async (
    _: IEditCommunity,
    context: IContext,
  ) => {
    const community = context.community
    const admin = context.user
    return {
      msg: `User '${admin.username}' is not a Community Admin anymore`,
      status: 200,
      data: await this.CommunityService.removeAdmin({ community, admin }),
    }
  }

  public static readonly join = async (_: any, context: IContext) => {
    const community = context.community
    const profile = context.profile

    return {
      msg: await this.CommunityService.join({ community, profile }),
      status: 200,
    }
  }

  public static readonly leave = async (_: any, context: IContext) => {
    const community = context.community
    const { _id: profileId } = context.profile

    return {
      msg: `We are sorry to See you leaving "${community.name}" Community `,
      status: 200,
      data: await this.CommunityService.leave({ profileId, community }),
    }
  }

  public static readonly acceptJoinRequest = async (
    _: any,
    context: IContext,
  ) => {
    const community = context.community
    const user = context.user

    return {
      msg: 'Join Request Has Been Accepted Successfully',

      status: 200,
      data: await this.CommunityService.acceptJoinRequest({ community, user }),
    }
  }

  public static readonly rejectJoinRequest = async (
    _: any,
    context: IContext,
  ) => {
    const community = context.community
    const user = context.user

    return {
      msg: 'Join Request Has Been Rejected Successfully',
      status: 200,
      data: await this.CommunityService.rejectJoinRequest({ community, user }),
    }
  }

  public static readonly kickOut = async (_: any, context: IContext) => {
    const community = context.community
    const user = context.user

    return {
      msg: `User ${user.username} has been kicked out successfully`,
      status: 200,
      data: await this.CommunityService.kickOut({ community, user }),
    }
  }
}
