import postService from "../post.service"
import * as DTO from "../dto/post.dto"

import {
  IContext,
  ISuccessResponse,
} from "../../../../common/interface/IGraphQL.interface"

class PostQueryResolver {
  private readonly postService = postService

  public readonly getAll = async (
    args: DTO.IGetAll,
    _: any,
  ): Promise<ISuccessResponse> => {
    return {
      msg: "done",
      status: 200,
      data: await this.postService.getAll(args),
    }
  }

  public readonly getSingle = (_: any, context: IContext): ISuccessResponse => {
    const { post } = context
    return {
      msg: "done",
      status: 200,
      data: post,
    }
  }
}
class PostMutationResolver {
  private readonly postService = postService

  public readonly edit = async (args: DTO.IEditPost, context: IContext) => {
    const { _id: postId } = context.post
    return {
      msg: "Post is modified successfully",
      status: 200,
      data: this.postService.edit({ postId, editPost: args }),
    }
  }

  public readonly save = async (_: any, context: IContext) => {
    const { _id: profileId } = context.profile
    const { _id: postId } = context.post

    return {
      msg: "Post is saved successfully",
      status: 200,
      data: this.postService.save({ postId, profileId }),
    }
  }

  public readonly shared = async (_: any, context: IContext) => {
    const { _id: postId } = context.post

    return {
      msg: "Post's shares count been updated successfully",
      status: 200,
      data: this.postService.shared(postId),
    }
  }

  public readonly archive = async (_: any, context: IContext) => {
    const { _id: postId } = context.post

    return {
      msg: "Post is archived successfully",
      status: 200,
      data: this.postService.archive(postId),
    }
  }
  public readonly restore = async (_: any, context: IContext) => {
    const { _id: postId } = context.post

    return {
      msg: "Post is restored successfully",
      status: 200,
      data: this.postService.restore(postId),
    }
  }

  public readonly deletePost = async (_: any, context: IContext) => {
    const { _id: profileId } = context.profile
    const { _id: postId } = context.post

    return {
      msg: "Post is deleted successfully",
      status: 200,
      data: this.postService.delete({ profileId, postId }),
    }
  }
}

export const postQueryResolver = new PostQueryResolver()
export const postMutationResolver = new PostMutationResolver()
