import {
  IContext,
  ISuccessResponse,
} from '../../../common/decorators/graphql/types/IGraphQL.interface'
import { IEditPostDTO, IGetAllDTO, IGetSinglePostDTO } from '../dto/post.dto'
import { PostService } from '../post.service'

export class PostQueryResolver {
  private static readonly PostService = PostService

  static readonly getAll = async (
    args: IGetAllDTO,
    _: any,
  ): Promise<ISuccessResponse> => {
    return {
      msg: 'done',
      status: 200,
      data: await this.PostService.getAll(args),
    }
  }

  static readonly getSingle = (_: any, context: IContext): ISuccessResponse => {
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

  static readonly edit = async (args: IEditPostDTO, context: IContext) => {
    const { _id: postId } = context.post
    return {
      msg: 'Post has been modified successfully',
      status: 200,
      data: this.PostService.edit({ postId, editPostDTO: args }),
    }
  }

  static readonly save = async (_: any, context: IContext) => {
    const { _id: profileId } = context.profile
    const { _id: postId } = context.post

    return {
      msg: 'Post has been saved successfully',
      status: 200,
      data: this.PostService.save({ postId, profileId }),
    }
  }

  static readonly shared = async (_: any, context: IContext) => {
    const { _id: postId } = context.post

    return {
      msg: "Post's shares count been updated successfully",
      status: 200,
      data: this.PostService.shared(postId),
    }
  }

  static readonly archive = async (_: any, context: IContext) => {
    const { _id: postId } = context.post

    return {
      msg: 'Post has been archived successfully',
      status: 200,
      data: this.PostService.archive(postId),
    }
  }
  static readonly restore = async (_: any, context: IContext) => {
    const { _id: postId } = context.post

    return {
      msg: 'Post has been restored successfully',
      status: 200,
      data: this.PostService.restore(postId),
    }
  }

  static readonly deletePost = async (_: any, context: IContext) => {
    const { _id: profileId } = context.profile
    const { _id: postId } = context.post

    return {
      msg: 'Post has been deleted successfully',
      status: 200,
      data: this.PostService.delete({ profileId, postId }),
    }
  }
}
