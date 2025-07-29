import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import { ChatService } from '../chat.service'
import { IDeleteMessage, ILikeMessage, IStartChat } from '../dto/chat.dto'

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

  public static readonly startChat = async (
    { message }: Pick<IStartChat, 'message'>,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    const { _id: userId, username } = context.user

    await this.ChatService.startChat({
      message,
      profileId,
      userId,
    })

    return {
      msg: `Message was sent to ${username} successfully`,
    }
  }

  public static readonly likeMessage = async (
    { messageId }: Pick<ILikeMessage, 'messageId'>,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: chatId } = context.chat

    await this.ChatService.likeMessage({
      messageId,
      chatId,
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
    const { _id: chatId } = context.chat

    await this.ChatService.deleteMessage({
      chatId,
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
    const { _id: chatId } = context.chat

    await this.ChatService.deleteChat({
      profileId,
      chatId,
    })

    return {
      msg: 'Chat is deleted successfully',
      status: 200,
    }
  }
}
