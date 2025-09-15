import communityService from "../community.service"
import postService from "../../post/post.service"

import { ICreateCommunity, IEditCommunity } from "../dto/community.dto"

import {
  IContext,
  ISuccessResponse,
} from "../../../../common/interface/IGraphQL.interface"

class CommunityQueryResolver {
  private readonly communityService = communityService

  public readonly getAllCommunities = async (
    _: any,
    __: any,
  ): Promise<ISuccessResponse> => {
    return {
      msg: "done",
      status: 200,
      data: await this.communityService.getAllCommunities(),
    }
  }

  public readonly getCommunity = (
    _: null,
    context: IContext,
  ): ISuccessResponse => {
    const { _id: profileId } = context.profile
    const { community } = context

    return {
      msg: "done",
      status: 200,
      data: this.communityService.getCommunity({ profileId, community }),
    }
  }

  public readonly getCommunityMembers = (
    _: null,
    context: IContext,
  ): ISuccessResponse => {
    const { _id: profileId } = context.profile
    const { community } = context

    return {
      msg: "done",
      status: 200,
      data: this.communityService.getCommunityMembers({ profileId, community }),
    }
  }
}

class CommunityMutationResolver {
  private readonly communityService = communityService
  private readonly postService = postService

  public readonly create = async (
    args: ICreateCommunity,
    context: IContext,
  ) => {
    const { _id: profileId } = context.profile

    return {
      status: 201,
      msg: "Community is created Successfully",
      data: await this.communityService.create({
        createdBy: profileId,
        createCommunityDTO: args,
      }),
    }
  }

  public readonly edit = async (args: IEditCommunity, context: IContext) => {
    const { _id: communityId } = context.community
    return {
      msg: "Community is modified successfully",
      status: 200,
      data: await this.communityService.editCommunity({
        communityId,
        editCommunity: args,
      }),
    }
  }

  public readonly changeVisibility = async (
    args: IEditCommunity,
    context: IContext,
  ) => {
    const { _id: communityId, isPrivateCommunity } = context.community

    await this.communityService.changeVisibility({
      communityId,
      state: isPrivateCommunity,
    })

    return {
      msg: "Community Visibility is Changed successfully",
      status: 200,
    }
  }

  public readonly deleteCommunity = async (_: any, context: IContext) => {
    const { _id: communityId } = context.community

    await this.communityService.deleteCommunity(communityId)

    return {
      msg: "Community is deleted successfully",
      status: 200,
    }
  }

  public readonly removePostFromCommunity = async (
    _: any,
    context: IContext,
  ) => {
    const { _id: communityId, name } = context.community
    const { _id: postId } = context.post

    await this.postService.removeFromCommunity({ communityId, postId })

    return {
      msg: `Post is deleted from ${name} Community Successfully`,
      status: 200,
    }
  }

  public readonly addAdmin = async (_: any, context: IContext) => {
    const { _id: communityId } = context.community
    const { _id: userId, username } = context.user

    return {
      msg: `User '${username}' is now a Community Admin`,
      status: 200,
      data: await this.communityService.addAdmin({ communityId, userId }),
    }
  }

  public readonly removeAdmin = async (
    _: IEditCommunity,
    context: IContext,
  ) => {
    const community = context.community
    const admin = context.user
    return {
      msg: `User '${admin.username}' is not a Community Admin anymore`,
      status: 200,
      data: await this.communityService.removeAdmin({ community, admin }),
    }
  }

  public readonly join = async (_: any, context: IContext) => {
    const community = context.community
    const profile = context.profile

    return {
      msg: await this.communityService.join({ community, profile }),
      status: 200,
    }
  }

  public readonly leave = async (_: any, context: IContext) => {
    const community = context.community
    const { _id: profileId } = context.profile

    return {
      msg: `We are sorry to See you leaving "${community.name}" Community `,
      status: 200,
      data: await this.communityService.leave({ profileId, community }),
    }
  }

  public readonly acceptJoinRequest = async (_: any, context: IContext) => {
    const community = context.community
    const user = context.user

    return {
      msg: "Join Request Has Been Accepted Successfully",

      status: 200,
      data: await this.communityService.acceptJoinRequest({ community, user }),
    }
  }

  public readonly rejectJoinRequest = async (_: any, context: IContext) => {
    const community = context.community
    const user = context.user

    return {
      msg: "Join Request Has Been Rejected Successfully",
      status: 200,
      data: await this.communityService.rejectJoinRequest({ community, user }),
    }
  }

  public readonly kickOut = async (_: any, context: IContext) => {
    const community = context.community
    const user = context.user

    return {
      msg: `User ${user.username} has been kicked out successfully`,
      status: 200,
      data: await this.communityService.kickOut({ community, user }),
    }
  }
}

export const communityQueryResolver = new CommunityQueryResolver()
export const communityMutationResolver = new CommunityMutationResolver()
