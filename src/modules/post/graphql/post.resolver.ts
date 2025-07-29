import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import * as DTO from '../dto/post.dto'

import { PostService } from '../post.service'

export class PostQueryResolver {
  private static readonly PostService = PostService

  public static readonly getAll = async (
    args: DTO.IGetAll,
    _: any,
  ): Promise<ISuccessResponse> => {
    return {
      msg: 'done',
      status: 200,
      data: await this.PostService.getAll(args),
    }
  }

  public static readonly getSingle = (
    _: any,
    context: IContext,
  ): ISuccessResponse => {
    const { post } = context
    return {
      msg: 'done',
      status: 200,
      data: post,
    }
  }
}
export class PostMutationResolver {
  private static readonly PostService = PostService

  public static readonly edit = async (
    args: DTO.IEditPost,
    context: IContext,
  ) => {
    const { _id: postId } = context.post
    return {
      msg: 'Post is modified successfully',
      status: 200,
      data: this.PostService.edit({ postId, editPost: args }),
    }
  }

  public static readonly save = async (_: any, context: IContext) => {
    const { _id: profileId } = context.profile
    const { _id: postId } = context.post

    return {
      msg: 'Post is saved successfully',
      status: 200,
      data: this.PostService.save({ postId, profileId }),
    }
  }

  public static readonly shared = async (_: any, context: IContext) => {
    const { _id: postId } = context.post

    return {
      msg: "Post's shares count been updated successfully",
      status: 200,
      data: this.PostService.shared(postId),
    }
  }

  public static readonly archive = async (_: any, context: IContext) => {
    const { _id: postId } = context.post

    return {
      msg: 'Post is archived successfully',
      status: 200,
      data: this.PostService.archive(postId),
    }
  }
  public static readonly restore = async (_: any, context: IContext) => {
    const { _id: postId } = context.post

    return {
      msg: 'Post is restored successfully',
      status: 200,
      data: this.PostService.restore(postId),
    }
  }

  public static readonly deletePost = async (_: any, context: IContext) => {
    const { _id: profileId } = context.profile
    const { _id: postId } = context.post

    return {
      msg: 'Post is deleted successfully',
      status: 200,
      data: this.PostService.delete({ profileId, postId }),
    }
  }
}
