import { CommunityService } from '../community.service'
import { PostService } from '../../post/post.service'
import { IEditCommunity } from '../dto/community.dto'

import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

export class CommunityQueryResolver {
  private static readonly CommunityService = CommunityService

  public static readonly getCommunity = (
    _: any,
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
}
export class CommunityMutationResolver {
  private static readonly CommunityService = CommunityService
  private static readonly PostService = PostService

  public static readonly addAdmin = async (_: any, context: IContext) => {
    const community = context.community
    const { _id: userId, username } = context.user

    return {
      msg: `User '${username}' is now a Community Admin`,
      status: 200,
      data: await this.CommunityService.addAdmin({ community, userId }),
    }
  }

  public static readonly removeAdmin = async (
    args: IEditCommunity,
    context: IContext,
  ) => {
    const community = context.community
    const { _id: userId, username } = context.user
    return {
      msg: `User '${username}' is not a Community Admin anymore`,
      status: 200,
      data: await this.CommunityService.removeAdmin({ community, userId }),
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
      data: await this.CommunityService.edit({
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

    await this.CommunityService.delete(communityId)

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
}
