import { Response } from 'express'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { successResponse } from '../../../common/handlers/success-response.handler'
import { PostService } from './../post.service'

import * as DTO from '../dto/post.dto'

export class PostController {
  private static readonly PostService = PostService

  public static readonly getAll = asyncHandler(
    async (req: IRequest<null, DTO.IGetAll>, res: Response) => {
      const query = req.query
      return successResponse(res, {
        data: await this.PostService.getAll(query),
      })
    },
  )

  public static readonly getSingle = asyncHandler(
    async (req: IRequest<DTO.IGetSinglePost>, res: Response) => {
      const isExistedPost = req.post
      return successResponse(res, {
        data: isExistedPost,
      })
    },
  )

  public static readonly create = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.profile
      const attachments = req.cloudFiles
      const createPost: DTO.ICreatePost = req.body
      return successResponse(res, {
        status: 201,
        msg: 'Post Uploaded Successfully',
        data: await this.PostService.create({
          createdBy: _id,
          createPost,
          attachments,
        }),
      })
    },
  )

  public static readonly edit = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: postId } = req.post
      const editPost: DTO.IEditPost = req.body

      return successResponse(res, {
        msg: 'Post is modified successfully',
        data: await this.PostService.edit({ postId, editPost }),
      })
    },
  )

  public static readonly save = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const { _id: postId } = req.post
      await this.PostService.save({ postId, profileId })
      return successResponse(res, {
        msg: 'Post is Saved successfully',
      })
    },
  )

  public static readonly shared = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const { _id: postId, createdBy } = req.post

      if (createdBy.equals(profileId))
        return successResponse(res, {
          msg: 'Done',
        })

      await this.PostService.shared(postId)

      return successResponse(res, {
        msg: "Post's shares count been updated successfully",
      })
    },
  )

  public static readonly like = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { msg } = await this.PostService.like({
        post: req.post,
        profile: req.profile,
      })

      return successResponse(res, { msg })
    },
  )

  public static readonly archive = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: postId } = req.post

      await this.PostService.archive(postId)

      return successResponse(res, {
        msg: 'Post is archived successfully',
      })
    },
  )

  public static readonly restore = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: postId } = req.post

      await this.PostService.restore(postId)

      return successResponse(res, {
        msg: 'Post is restored successfully',
      })
    },
  )

  public static readonly delete = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const { _id: postId } = req.post

      await this.PostService.delete({ profileId, postId })

      return successResponse(res, {
        msg: 'Post is deleted successfully',
      })
    },
  )
}
