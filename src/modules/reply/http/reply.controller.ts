import { Response } from 'express'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { IAddReply, IEditReply, IGetCommentReplies } from '../dto/reply.dto'
import { IReplyToCommentNotification } from '../../../db/interface/INotification.interface'
import { ReplyService } from '../reply.service'

import onlineUsersController from '../../../common/services/notifications/online-users.controller'
import notificationsService from '../../../common/services/notifications/notification.service'

export class ReplyController {
  protected static readonly ReplyService = ReplyService
  protected static readonly notificationsService = notificationsService

  static readonly getCommentReplies = asyncHandler(
    async (req: IRequest<IGetCommentReplies>, res: Response) => {
      const { commentId } = req.params
      return successResponse(res, {
        data: await this.ReplyService.getCommentReplies(commentId),
      })
    },
  )

  static readonly reply = asyncHandler(
    async (
      req: IRequest<Pick<IGetCommentReplies, 'commentId'>>,
      res: Response,
    ) => {
      const { _id: profileId, username, fullName, avatar } = req.profile
      const { _id: commentId, attachment, createdBy } = req.comment

      const { content }: IAddReply = req.body

      await this.ReplyService.reply({
        replyingTo: commentId,
        content,
        createdBy: profileId,
      })

      const notification: IReplyToCommentNotification = {
        title: `${username} Replied To Your Comment! 💚`,
        content,
        from: { _id: profileId, username, fullName, avatar },
        on: { _id: commentId, attachment },
        refTo: 'Comment',
      }

      await this.notificationsService.sendNotification({
        to: createdBy,
        notification,
      })

      return successResponse(res, {
        msg: 'Comment has been added Successfully',
        status: 201,
      })
    },
  )

  static readonly edit = asyncHandler(async (req: IRequest, res: Response) => {
    const { _id: replyId } = req.reply
    const { content }: IEditReply = req.body
    return successResponse(res, {
      msg: 'Comment has been Modified Successfully',
      data: await this.ReplyService.edit({
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
        data: await this.ReplyService.deleteReply({ replyId }),
      })
    },
  )
}
