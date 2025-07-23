import { Response } from 'express'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { MongoId } from '../../../common/types/db/db.types'
import { IPostId } from '../../post/dto/post.dto'
import { CommentService } from '../comment.service'

import * as DTO from '../dto/comment.dto'

export class CommentController {
  private static readonly CommentService = CommentService

  static readonly getSingle = asyncHandler(
    async (req: IRequest, res: Response) => {
      return successResponse(res, {
        data: req.comment,
      })
    },
  )

  static readonly addComment = asyncHandler(
    async (req: IRequest<IPostId>, res: Response) => {
      const attachment = req.cloudFile
      const { content }: Pick<DTO.IAddComment, 'content'> = req.body

      await this.CommentService.addComment({
        attachment,
        content,
        profile: req.profile,
        post: req.post,
      })

      return successResponse(res, {
        msg: 'Comment added Successfully',
        status: 201,
      })
    },
  )

  static readonly like = asyncHandler(async (req: IRequest, res: Response) => {
    const { msg } = await this.CommentService.like({
      profile: req.profile,
      comment: req.comment,
    })

    return successResponse(res, { msg })
  })

  static readonly edit = asyncHandler(
    async (req: IRequest<DTO.ICommentId>, res: Response) => {
      const { commentId } = req.params
      const { content }: DTO.IEditComment = req.body
      return successResponse(res, {
        msg: 'Comment is modified Successfully',
        data: await this.CommentService.edit({
          id: commentId,
          content,
        }),
      })
    },
  )

  static readonly deleteComment = asyncHandler(
    async (req: IRequest<{ commentId: MongoId }>, res: Response) => {
      const { commentId } = req.params
      await this.CommentService.deleteComment({ id: commentId })
      return successResponse(res, {
        msg: 'Comment is deleted successfully',
      })
    },
  )
}
