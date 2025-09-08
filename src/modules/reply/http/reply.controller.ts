import { Response } from "express"
import { successResponse } from "../../../common/handlers/success-response.handler"
import { IRequest } from "../../../common/interface/IRequest.interface"
import { asyncHandler } from "../../../common/decorators/async-handler/async-handler.decorator"

import { IAddReply, IEditReply, IGetCommentReplies } from "../dto/reply.dto"

import replyService from "../reply.service"

class ReplyController {
  private readonly replyService = replyService

  public readonly getCommentReplies = asyncHandler(
    async (req: IRequest<IGetCommentReplies>, res: Response) => {
      const { commentId } = req.params
      return successResponse(res, {
        data: await this.replyService.getCommentReplies(commentId),
      })
    },
  )

  public readonly reply = asyncHandler(
    async (
      req: IRequest<Pick<IGetCommentReplies, "commentId">>,
      res: Response,
    ) => {
      const { content }: IAddReply = req.body

      await this.replyService.reply({
        content,
        profile: req.profile,
        comment: req.comment,
      })

      return successResponse(res, {
        msg: "Replied to Comment Successfully",
        status: 201,
      })
    },
  )

  public readonly like = asyncHandler(async (req: IRequest, res: Response) => {
    const { msg } = await this.replyService.like({
      profile: req.profile,
      reply: req.reply,
    })

    return successResponse(res, { msg })
  })

  public readonly edit = asyncHandler(async (req: IRequest, res: Response) => {
    const { _id: replyId } = req.reply
    const { content }: IEditReply = req.body

    return successResponse(res, {
      msg: "Comment is Modified Successfully",
      data: await this.replyService.edit({
        replyId,
        content,
      }),
    })
  })

  public readonly deleteReply = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: replyId } = req.reply
      return successResponse(res, {
        msg: "Comment is Deleted successfully",
        data: await this.replyService.deleteReply({ replyId }),
      })
    },
  )
}

export default new ReplyController()
