import { Response } from 'express'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { IAddReply, IEditReply, IGetCommentReplies } from '../dto/reply.dto'
import replyService from '../reply.service'

export class ReplyController {
  protected static readonly replyService = replyService

  static readonly getCommentReplies = asyncHandler(
    async (req: IRequest<IGetCommentReplies>, res: Response) => {
      const { commentId } = req.params
      return successResponse(res, {
        data: await this.replyService.getCommentReplies(commentId),
      })
    },
  )

  static readonly reply = asyncHandler(
    async (
      req: IRequest<Pick<IGetCommentReplies, 'commentId'>>,
      res: Response,
    ) => {
      const { _id: profileId } = req.profile
      const { commentId } = req.params
      const { content }: IAddReply = req.body
      return successResponse(res, {
        msg: 'Comment has been add Successfully',
        status: 201,
        data: await this.replyService.reply({
          replyingTo: commentId,
          content,
          createdBy: profileId,
        }),
      })
    },
  )

  static readonly edit = asyncHandler(async (req: IRequest, res: Response) => {
    const { _id: replyId } = req.reply
    const { content }: IEditReply = req.body
    return successResponse(res, {
      msg: 'Comment has been Modified Successfully',
      data: await this.replyService.edit({
        replyId,
        content,
      }),
    })
  })

  static readonly deleteReply = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: replyId } = req.reply
      return successResponse(res, {
        msg: 'Comment has been Deleted successfully',
        data: await this.replyService.deleteReply({ replyId }),
      })
    },
  )
}
