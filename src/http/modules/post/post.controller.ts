import { Response } from 'express'
import { asyncHandler } from '../../../common/decorators/async-handler.decorator'
import { IRequest } from '../../../common/interface/http/IRequest.interface'
import { PostService } from './post.service'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import {
  ICreatePostDTO,
  IEditPostDTO,
  IGetAllDTO,
  IGetSinglePostDTO,
} from './dto/post.dto'

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
      const createPostDTO: ICreatePostDTO = req.body
      const attachments = req.cloudFiles.paths
      return successResponse(res, {
        status: 201,
        data: await this.PostService.create(_id, createPostDTO, attachments),
      })
    },
  )

  static readonly edit = asyncHandler(async (req: IRequest, res: Response) => {
    const { _id } = req.profile
    const { _id: postId } = req.post
    const editPostDTO: IEditPostDTO = req.body

    return successResponse(res, {
      msg: 'Post has been modified successfully',
      data: await this.PostService.edit(_id, postId, editPostDTO),
    })
  })

  static readonly archive = asyncHandler(
    async (req: IRequest<any>, res: Response) => {
      const { _id } = req.profile
      const { _id: postId } = req.post
      return successResponse(res, {
        msg: 'Post has been archived successfully',
        data: await this.PostService.archive(_id, postId),
      })
    },
  )

  static readonly restore = asyncHandler(
    async (req: IRequest<any>, res: Response) => {
      const { _id } = req.profile
      const { _id: postId } = req.post
      await this.PostService.restore(_id, postId)
      return successResponse(res, {
        msg: 'Post has been restored successfully',
      })
    },
  )

  static readonly delete = asyncHandler(
    async (req: IRequest<any>, res: Response) => {
      const { _id } = req.profile
      const { _id: postId } = req.post
      await this.PostService.delete(_id, postId)
      return successResponse(res, {
        msg: 'Post has been deleted successfully',
      })
    },
  )
}
