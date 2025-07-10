import {
  IContext,
  ISuccessResponse,
} from '../../../common/decorators/resolver/types/IGraphQL.interface'
import commentService from '../comment.service'
import { IEditCommentDTO } from '../dto/comment.dto'

export class CommentQueryResolver {
  private static readonly commentService = commentService

  static readonly getPostComments = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: postId } = context.post
    return {
      msg: 'done',
      status: 200,
      data: await this.commentService.getPostComments(postId),
    }
  }
}

export class CommentMutationResolver {
  private static readonly commentService = commentService

  static readonly edit = async (
    args: IEditCommentDTO,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: commentId } = context.comment
    return {
      msg: 'done',
      status: 201,
      data: await this.commentService.edit({ commentId, editCommentDTO: args }),
    }
  }
}
