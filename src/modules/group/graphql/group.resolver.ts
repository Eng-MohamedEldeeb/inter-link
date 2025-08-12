import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import { GroupService } from '../group.service'

import { IDeleteMessage, ILikeMessage } from '../dto/group.dto'

export class ChatQueryResolver {
  private static readonly GroupService = GroupService

  public static readonly getAllChats = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    return {
      msg: 'done',
      status: 200,
      data: await this.GroupService.getAllGroups(profileId),
    }
  }

  public static readonly getSingleChat = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    return {
      msg: 'done',
      status: 200,
      data: context.group,
    }
  }
}

export class ChatMutationResolver {
  private static readonly GroupService = GroupService

  public static readonly likeMessage = async (
    { messageId }: Pick<ILikeMessage, 'messageId'>,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: groupId } = context.group

    // await this.GroupService.likeMessage({
    //   messageId,
    //   groupId,
    // })

    return {
      msg: 'Liked the Message successfully',
      status: 200,
    }
  }

  public static readonly deleteMessage = async (
    { messageId }: Pick<IDeleteMessage, 'messageId'>,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: groupId } = context.group
    const { _id: profileId } = context.profile

    await this.GroupService.deleteMessage({
      groupId,
      profileId,
      messageId,
    })

    return {
      msg: 'Message is Deleted successfully',
      status: 200,
    }
  }

  public static readonly deleteChat = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    const group = context.group

    await this.GroupService.deleteChat({
      profileId,
      group,
    })

    return {
      msg: 'Chat is deleted successfully',
      status: 200,
    }
  }
}
