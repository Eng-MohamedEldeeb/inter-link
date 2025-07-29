import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import { IEditReply, ILikeReply } from '../dto/reply.dto'

import { ReplyService } from '../reply.service'

export class ReplyQueryResolver {
  private static readonly ReplyService = ReplyService

  public static readonly getCommentReplies = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: postId } = context.post
    return {
      msg: 'done',
      status: 200,
      data: await this.ReplyService.getCommentReplies(postId),
    }
  }
}

export class ReplyMutationResolver {
  private static readonly ReplyService = ReplyService

  public static readonly like = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    return {
      msg: 'Reply is Liked successfully',
      status: 201,
      data: await this.ReplyService.like({
        profile: context.profile,
        reply: context.reply,
      }),
    }
  }

  public static readonly edit = async (
    args: IEditReply,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: replyId } = context.reply
    return {
      msg: 'Reply is modified successfully',
      status: 201,
      data: await this.ReplyService.edit({
        replyId,
        content: args.content,
      }),
    }
  }

  public static readonly deleteReply = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: replyId } = context.reply
    return {
      msg: 'Reply is deleted successfully',
      status: 201,
      data: await this.ReplyService.deleteReply({ replyId }),
    }
  }
}
