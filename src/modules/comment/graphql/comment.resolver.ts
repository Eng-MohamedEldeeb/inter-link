import commentService from "../comment.service"

import {
  IContext,
  ISuccessResponse,
} from "../../../common/interface/IGraphQL.interface"

import { IEditComment } from "../dto/comment.dto"

class CommentQueryResolver {
  public readonly getSingleComment = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    return {
      msg: "done",
      status: 200,
      data: context.comment,
    }
  }
}

class CommentMutationResolver {
  private readonly commentService = commentService

  public readonly like = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    return {
      msg: "Comment is liked successfully",
      data: await this.commentService.like({
        profile: context.profile,
        comment: context.comment,
      }),
    }
  }

  public readonly edit = async (
    args: IEditComment,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: commentId } = context.comment
    return {
      msg: "Comment is modified successfully",
      status: 201,
      data: await this.commentService.edit({
        id: commentId,
        content: args.content,
      }),
    }
  }

  public readonly deleteComment = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: commentId } = context.comment
    return {
      msg: "Comment is deleted successfully",
      status: 201,
      data: await this.commentService.deleteComment({ id: commentId }),
    }
  }
}

export const commentQueryResolver = new CommentQueryResolver()
export const commentMutationResolver = new CommentMutationResolver()
