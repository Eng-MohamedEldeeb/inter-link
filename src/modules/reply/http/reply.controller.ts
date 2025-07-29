import { Response } from 'express'
import { successResponse } from '../../../common/handlers/success-response.handler'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'

import { IAddReply, IEditReply, IGetCommentReplies } from '../dto/reply.dto'

import { ReplyService } from '../reply.service'

export class ReplyController {
  protected static readonly ReplyService = ReplyService

  public static readonly getCommentReplies = asyncHandler(
    async (req: IRequest<IGetCommentReplies>, res: Response) => {
      const { commentId } = req.params
      return successResponse(res, {
        data: await this.ReplyService.getCommentReplies(commentId),
      })
    },
  )

  public static readonly reply = asyncHandler(
    async (
      req: IRequest<Pick<IGetCommentReplies, 'commentId'>>,
      res: Response,
    ) => {
      const { content }: IAddReply = req.body

      await this.ReplyService.reply({
        content,
        profile: req.profile,
        comment: req.comment,
      })

      return successResponse(res, {
        msg: 'Replied to Comment Successfully',
        status: 201,
      })
    },
  )

  public static readonly like = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { msg } = await this.ReplyService.like({
        profile: req.profile,
        reply: req.reply,
      })

      return successResponse(res, { msg })
    },
  )

  public static readonly edit = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: replyId } = req.reply
      const { content }: IEditReply = req.body

      return successResponse(res, {
        msg: 'Comment is Modified Successfully',
        data: await this.ReplyService.edit({
          replyId,
          content,
        }),
      })
    },
  )

  public static readonly deleteReply = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: replyId } = req.reply
      return successResponse(res, {
        msg: 'Comment is Deleted successfully',
        data: await this.ReplyService.deleteReply({ replyId }),
      })
    },
  )
}
