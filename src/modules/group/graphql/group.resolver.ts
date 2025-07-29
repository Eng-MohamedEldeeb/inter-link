import { GroupService } from '../group.service'
import { PostService } from '../../post/post.service'
import { IEditGroup } from '../dto/group.dto'

import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

export class GroupQueryResolver {
  private static readonly GroupService = GroupService

  public static readonly getGroup = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const { _id: profileId } = context.profile
    const { group } = context

    return {
      msg: 'done',
      status: 200,
      data: this.GroupService.getGroup({ profileId, group }),
    }
  }
}
export class GroupMutationResolver {
  private static readonly GroupService = GroupService
  private static readonly PostService = PostService

  public static readonly addAdmin = async (_: any, context: IContext) => {
    const group = context.group
    const { _id: userId, username } = context.user

    return {
      msg: `User '${username}' is now a Group Admin`,
      status: 200,
      data: await this.GroupService.addAdmin({ group, userId }),
    }
  }

  public static readonly removeAdmin = async (
    args: IEditGroup,
    context: IContext,
  ) => {
    const group = context.group
    const { _id: userId, username } = context.user
    return {
      msg: `User '${username}' is not a Group Admin anymore`,
      status: 200,
      data: await this.GroupService.removeAdmin({ group, userId }),
    }
  }

  public static readonly edit = async (args: IEditGroup, context: IContext) => {
    const { _id: groupId } = context.group
    return {
      msg: 'Group is modified successfully',
      status: 200,
      data: await this.GroupService.edit({ groupId, editGroup: args }),
    }
  }

  public static readonly changeVisibility = async (
    args: IEditGroup,
    context: IContext,
  ) => {
    const { _id: groupId, isPrivateGroup } = context.group

    await this.GroupService.changeVisibility({
      groupId,
      state: isPrivateGroup,
    })

    return {
      msg: 'Group Visibility is Changed successfully',
      status: 200,
    }
  }

  public static readonly deleteGroup = async (_: any, context: IContext) => {
    const { _id: groupId } = context.group

    await this.GroupService.delete(groupId)

    return {
      msg: 'Group is deleted successfully',
      status: 200,
    }
  }

  public static readonly removePostFromGroup = async (
    _: any,
    context: IContext,
  ) => {
    const { _id: groupId, name } = context.group
    const { _id: postId } = context.post

    await this.PostService.removeFromGroup({ groupId, postId })

    return {
      msg: `Post is deleted from ${name} Group Successfully`,
      status: 200,
    }
  }
}
