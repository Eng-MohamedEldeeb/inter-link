import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import { ChatService } from '../chat-group.service'
import {
  IDeleteChat,
  IDeleteMessage,
  ILikeMessage,
} from '../dto/chat-group.dto'

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
    const { _id: chatId } = context.chat

    // await this.ChatService.likeMessage({
    //   messageId,
    //   chatId,
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
    const { _id: chatId } = context.chat
    const { _id: profileId } = context.profile

    await this.ChatService.deleteMessage({
      chatId,
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
    const chat = context.chat

    await this.ChatService.deleteChat({
      profileId,
      chat,
    })

    return {
      msg: 'Chat is deleted successfully',
      status: 200,
    }
  }
}
