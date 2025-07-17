import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import { IEditComment } from '../dto/comment.dto'

import commentService from '../comment.service'

export class CommentQueryResolver {
  static readonly getSingleComment = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    return {
      msg: 'done',
      status: 200,
      data: context.comment,
    }
  }
}

export class CommentMutationResolver {
  private static readonly commentService = commentService

  static readonly edit = async (
    args: IEditComment,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: commentId } = context.comment
    return {
      msg: 'Comment has been modified successfully',
      status: 201,
      data: await this.commentService.edit({
        id: commentId,
        content: args.content,
      }),
    }
  }

  static readonly deleteComment = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: commentId } = context.comment
    return {
      msg: 'Comment has been deleted successfully',
      status: 201,
      data: await this.commentService.deleteComment({ id: commentId }),
    }
  }
}
