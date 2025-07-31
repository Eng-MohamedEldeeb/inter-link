import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import { ChatService } from '../chat.service'
import { IDeleteMessage, ILikeMessage } from '../dto/chat.dto'

export class ChatQueryResolver {
  private static readonly ChatService = ChatService

  public static readonly getAllChats = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    return {
      msg: 'done',
      status: 200,
      data: await this.ChatService.getAllChats(profileId),
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
      data: context.chat,
    }
  }
}

export class ChatMutationResolver {
  private static readonly ChatService = ChatService

  public static readonly likeMessage = async (
    { messageId }: Pick<ILikeMessage, 'messageId'>,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: currentChatId } = context.chat

    await this.ChatService.likeMessage({
      messageId,
      currentChatId,
    })

    return {
      msg: 'Liked the Message successfully',
      status: 200,
    }
  }

  public static readonly deleteMessage = async (
    { messageId }: Pick<IDeleteMessage, 'messageId'>,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: currentChatId } = context.chat

    await this.ChatService.deleteMessage({
      currentChatId,
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
    const { _id: currentChatId } = context.chat

    await this.ChatService.deleteChat({
      profileId,
      currentChatId,
    })

    return {
      msg: 'Chat is deleted successfully',
      status: 200,
    }
  }
}
