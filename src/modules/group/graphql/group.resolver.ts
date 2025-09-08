import groupService from "../group.service"

import {
  IContext,
  ISuccessResponse,
} from "../../../common/interface/IGraphQL.interface"

import { IDeleteMessage, ILikeMessage } from "../dto/group.dto"

class GroupQueryResolver {
  private readonly groupService = groupService

  public readonly getAllGroups = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    return {
      msg: "done",
      status: 200,
      data: await this.groupService.getAllGroups(profileId),
    }
  }

  public readonly getSingleGroup = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    return {
      msg: "done",
      status: 200,
      data: context.group,
    }
  }
}

class GroupMutationResolver {
  private readonly groupService = groupService

  public readonly likeMessage = async (
    { messageId }: Pick<ILikeMessage, "messageId">,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: groupId } = context.group

    // await this.groupService.likeMessage({
    //   messageId,
    //   groupId,
    // })

    return {
      msg: "Liked the Message successfully",
      status: 200,
    }
  }

  public readonly deleteMessage = async (
    { messageId }: Pick<IDeleteMessage, "messageId">,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: groupId } = context.group
    const { _id: profileId } = context.profile

    await this.groupService.deleteMessage({
      groupId,
      profileId,
      messageId,
    })

    return {
      msg: "Message is Deleted successfully",
      status: 200,
    }
  }

  public readonly deleteGroup = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    const { _id: id } = context.group

    await this.groupService.deleteGroup({
      id,
      profileId,
    })

    return {
      msg: "Group is deleted successfully",
      status: 200,
    }
  }
}

export const groupQueryResolver = new GroupQueryResolver()
export const groupMutationResolver = new GroupMutationResolver()
