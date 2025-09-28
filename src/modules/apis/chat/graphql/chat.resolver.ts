import {
  IContext,
  ISuccessResponse,
} from "../../../../common/interface/IGraphQL.interface"
import chatService from "../chat.service"

import { IDeleteMessage, ILikeMessage } from "../dto/chat.dto"

class ChatQueryResolver {
  private readonly chatService = chatService

  public readonly getAllChats = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    return {
      msg: "done",
      status: 200,
      data: await this.chatService.getAllChats(profileId),
    }
  }

  public readonly getSingleChat = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    return {
      msg: "done",
      status: 200,
      data: context.chat,
    }
  }
}

class ChatMutationResolver {
  private readonly chatService = chatService

  public readonly likeMessage = async (
    { messageId }: Pick<ILikeMessage, "messageId">,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    const chat = context.chat

    await this.chatService.likeMessage({
      profileId,
      messageId,
      chat,
    })

    return {
      msg: "Liked the Message successfully",
      status: 200,
    }
  }

  public readonly deleteMessage = async (
    context: IContext,
  ): Promise<ISuccessResponse> => {
    await this.chatService.deleteMessage(context.message)

    return {
      msg: "Message is Deleted successfully",
      status: 200,
    }
  }

  public readonly deleteChat = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    const chat = context.chat

    await this.chatService.deleteChat({
      profileId,
      chat,
    })

    return {
      msg: "Chat is deleted successfully",
      status: 200,
    }
  }
}

export const chatQueryResolver = new ChatQueryResolver()
export const chatMutationResolver = new ChatMutationResolver()
