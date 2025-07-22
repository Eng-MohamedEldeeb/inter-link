import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import { IEditReply } from '../dto/reply.dto'

import { ReplyService } from '../reply.service'

export class ReplyQueryResolver {
  private static readonly ReplyService = ReplyService

  static readonly getCommentReplies = async (
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

  static readonly edit = async (
    args: IEditReply,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: replyId } = context.reply
    return {
      msg: 'Reply has been modified successfully',
      status: 201,
      data: await this.ReplyService.edit({
        replyId,
        content: args.content,
      }),
    }
  }

  static readonly deleteReply = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: replyId } = context.reply
    return {
      msg: 'Reply has been deleted successfully',
      status: 201,
      data: await this.ReplyService.deleteReply({ replyId }),
    }
  }
}
