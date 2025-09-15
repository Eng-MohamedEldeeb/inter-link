import {
  IContext,
  ISuccessResponse,
} from "../../../../common/interface/IGraphQL.interface"

import { IEditReply, ILikeReply } from "../dto/reply.dto"

import replyService from "../reply.service"

class ReplyQueryResolver {
  private readonly replyService = replyService

  public readonly getCommentReplies = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: postId } = context.post
    return {
      msg: "done",
      status: 200,
      data: await this.replyService.getCommentReplies(postId),
    }
  }
}

class ReplyMutationResolver {
  private readonly replyService = replyService

  public readonly like = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    return {
      msg: "Reply is Liked successfully",
      status: 201,
      data: await this.replyService.like({
        profile: context.profile,
        reply: context.reply,
      }),
    }
  }

  public readonly edit = async (
    args: IEditReply,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: replyId } = context.reply
    return {
      msg: "Reply is modified successfully",
      status: 201,
      data: await this.replyService.edit({
        replyId,
        content: args.content,
      }),
    }
  }

  public readonly deleteReply = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: replyId } = context.reply
    return {
      msg: "Reply is deleted successfully",
      status: 201,
      data: await this.replyService.deleteReply({ replyId }),
    }
  }
}
export const replyQueryResolver = new ReplyQueryResolver()
export const replyMutationResolver = new ReplyMutationResolver()
