import { Response } from 'express'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import commentService from '../comment.service'
import { IRequest } from '../../../common/interface/http/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { IAddCommentDTO, IGetPostCommentsDTO } from '../dto/comment.dto'
import { MongoId } from '../../../common/types/db/db.types'

export class CommentController {
  protected static readonly commentService = commentService
  static readonly getPostComments = asyncHandler(
    async (req: IRequest<IGetPostCommentsDTO>, res: Response) => {
      const { postId } = req.params
      return successResponse(res, {
        data: await this.commentService.getPostComments(postId),
      })
    },
  )

  static readonly addComment = asyncHandler(
    async (
      req: IRequest<Pick<IGetPostCommentsDTO, 'postId'>>,
      res: Response,
    ) => {
      const { _id: profileId } = req.profile
      const attachment = req.cloudFile
      const { postId } = req.params
      const { content }: Pick<IAddCommentDTO, 'content'> = req.body

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

  static readonly deleteComment = asyncHandler(
    async (req: IRequest<{ commentId: MongoId }>, res: Response) => {
      const { commentId } = req.params

      return successResponse(res, {
        msg: 'Comment has been add Successfully',
        status: 201,
        data: await this.commentService.deleteComment(commentId),
      })
    },
  )
}
