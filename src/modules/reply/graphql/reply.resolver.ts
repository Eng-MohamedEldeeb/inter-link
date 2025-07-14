import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'
import commentService from '../reply.service'
import { IEditReplyDTO } from '../dto/reply.dto'

export class ReplyQueryResolver {
  private static readonly commentService = commentService

  static readonly getCommentReplies = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: postId } = context.post
    return {
      msg: 'done',
      status: 200,
      data: await this.commentService.getCommentReplies(postId),
    }
  }
}

export class ReplyMutationResolver {
  private static readonly commentService = commentService

  static readonly edit = async (
    args: IEditReplyDTO,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: replyId } = context.reply
    return {
      msg: 'Reply has been modified successfully',
      status: 201,
      data: await this.commentService.edit({
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
      data: await this.commentService.deleteReply({ replyId }),
    }
  }
}
