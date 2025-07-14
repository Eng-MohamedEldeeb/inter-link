import { Response } from 'express'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { PostService } from './../post.service'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import {
  ICreatePostDTO,
  IEditPostDTO,
  IGetAllDTO,
  IGetSinglePostDTO,
} from './../dto/post.dto'

export class PostController {
  private static readonly PostService = PostService

  static readonly getAll = asyncHandler(
    async (req: IRequest<null, IGetAllDTO>, res: Response) => {
      const query = req.query
      return successResponse(res, {
        data: await this.PostService.getAll(query),
      })
    },
  )

  static readonly getSingle = asyncHandler(
    async (req: IRequest<IGetSinglePostDTO>, res: Response) => {
      const isExistedPost = req.post
      return successResponse(res, {
        data: isExistedPost,
      })
    },
  )

  static readonly create = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.profile
      const attachments = req.cloudFiles
      const createPostDTO: ICreatePostDTO = req.body
      return successResponse(res, {
        status: 201,
        msg: 'Post Uploaded Successfully',
        data: await this.PostService.create({
          createdBy: _id,
          createPostDTO: { data: createPostDTO, attachments },
        }),
      })
    },
  )

  static readonly edit = asyncHandler(async (req: IRequest, res: Response) => {
    const { _id: postId } = req.post
    const editPostDTO: IEditPostDTO = req.body

    return successResponse(res, {
      msg: 'Post has been modified successfully',
      data: await this.PostService.edit({ postId, editPostDTO }),
    })
  })

  static readonly save = asyncHandler(async (req: IRequest, res: Response) => {
    const { _id: profileId } = req.profile
    const { _id: postId } = req.post
    await this.PostService.save({ postId, profileId })
    return successResponse(res, {
      msg: 'Post has been Saved successfully',
    })
  })

  static readonly shared = asyncHandler(
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

  static readonly archive = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: postId } = req.post
      return successResponse(res, {
        msg: 'Post has been archived successfully',
        data: await this.PostService.archive(postId),
      })
    },
  )

  static readonly restore = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: postId } = req.post
      await this.PostService.restore(postId)
      return successResponse(res, {
        msg: 'Post has been restored successfully',
      })
    },
  )

  static readonly delete = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const { _id: postId } = req.post
      await this.PostService.delete({ profileId, postId })
      return successResponse(res, {
        msg: 'Post has been deleted successfully',
      })
    },
  )
}
