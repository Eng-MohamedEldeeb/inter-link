import { Response } from 'express'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { MongoId } from '../../../common/types/db/db.types'

import commentService from '../comment.service'

import * as DTO from '../dto/comment.dto'

export class CommentController {
  protected static readonly commentService = commentService

  static readonly getSingle = asyncHandler(
    async (req: IRequest, res: Response) => {
      return successResponse(res, {
        data: req.comment,
      })
    },
  )

  static readonly addComment = asyncHandler(
    async (
      req: IRequest<Pick<DTO.IGetPostComments, 'postId'>>,
      res: Response,
    ) => {
      const { _id: profileId } = req.profile
      const attachment = req.cloudFile
      const { postId } = req.params
      const { content }: Pick<DTO.IAddComment, 'content'> = req.body

      return successResponse(res, {
        msg: 'Comment has been add Successfully',
        status: 201,
        data: await this.commentService.addComment({
          postId,
          attachment,
          content,
          createdBy: profileId,
        }),
      })
    },
  )

  static readonly edit = asyncHandler(
    async (req: IRequest<DTO.ICommentId>, res: Response) => {
      const { commentId } = req.params
      const { content }: DTO.IEditComment = req.body
      return successResponse(res, {
        msg: 'Comment has been modified Successfully',
        data: await this.commentService.edit({
          commentId,
          content,
        }),
      })
    },
  )

  static readonly deleteComment = asyncHandler(
    async (req: IRequest<{ commentId: MongoId }>, res: Response) => {
      const { commentId } = req.params
      await this.commentService.deleteComment({ commentId })
      return successResponse(res, {
        msg: 'Comment has been deleted successfully',
      })
    },
  )
}
