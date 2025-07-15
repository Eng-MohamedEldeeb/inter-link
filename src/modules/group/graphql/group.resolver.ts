import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'
import { IEditGroup } from '../dto/group.dto'
import { GroupService } from '../group.service'

export class GroupQueryResolver {
  private static readonly GroupService = GroupService

  static readonly getGroup = (_: any, context: IContext): ISuccessResponse => {
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

  static readonly edit = async (args: IEditGroup, context: IContext) => {
    const { _id: groupId } = context.group
    return {
      msg: 'Group has been modified successfully',
      status: 200,
      data: await this.GroupService.edit({ groupId, editGroup: args }),
    }
  }

  static readonly changeVisibility = async (
    args: IEditGroup,
    context: IContext,
  ) => {
    const { _id: groupId, isPrivateGroup } = context.group

    await this.GroupService.changeVisibility({
      groupId,
      state: isPrivateGroup,
    })

    return {
      msg: 'Group Visibility has been Changed successfully',
      status: 200,
    }
  }

  static readonly deleteGroup = async (_: any, context: IContext) => {
    const { _id: groupId } = context.group

    return {
      msg: 'Group has been deleted successfully',
      status: 200,
      data: await this.GroupService.delete(groupId),
    }
  }
}
