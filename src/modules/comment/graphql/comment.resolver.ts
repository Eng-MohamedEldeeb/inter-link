import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import { IEditComment } from '../dto/comment.dto'
import { CommentService } from '../comment.service'

export class CommentQueryResolver {
  public static readonly getSingleComment = async (
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
  private static readonly CommentService = CommentService

  public static readonly like = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    return {
      msg: 'Comment is liked successfully',
      data: await this.CommentService.like({
        profile: context.profile,
        comment: context.comment,
      }),
    }
  }

  public static readonly edit = async (
    args: IEditComment,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: commentId } = context.comment
    return {
      msg: 'Comment is modified successfully',
      status: 201,
      data: await this.CommentService.edit({
        id: commentId,
        content: args.content,
      }),
    }
  }

  public static readonly deleteComment = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: commentId } = context.comment
    return {
      msg: 'Comment is deleted successfully',
      status: 201,
      data: await this.CommentService.deleteComment({ id: commentId }),
    }
  }
}
