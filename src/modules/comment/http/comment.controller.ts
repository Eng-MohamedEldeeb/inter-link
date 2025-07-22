import { Response } from 'express'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { MongoId } from '../../../common/types/db/db.types'
import { IPostId } from '../../post/dto/post.dto'
import { CommentService } from '../comment.service'

import * as DTO from '../dto/comment.dto'

import onlineUsersController from '../../../common/services/notifications/online-users.controller'
import notificationsService from '../../../common/services/notifications/notification.service'
import { ICommentedOnPostNotification } from '../../../db/interface/INotification.interface'

export class CommentController {
  protected static readonly CommentService = CommentService
  protected static readonly onlineUsersController = onlineUsersController
  protected static readonly notificationsService = notificationsService

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

      const { _id: profileId, avatar, username, fullName } = req.profile
      const { _id: postId, createdBy, attachments } = req.post

      await this.CommentService.addComment({
        postId,
        attachment,
        content,
        createdBy: profileId,
      })

      const notification: ICommentedOnPostNotification = {
        title: `${username} Commented On Your Post! 💛`,
        content,
        from: { _id: profileId, avatar, username, fullName },
        on: { _id: postId, attachments },
        refTo: 'Post',
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

  static readonly edit = asyncHandler(
    async (req: IRequest<DTO.ICommentId>, res: Response) => {
      const { commentId } = req.params
      const { content }: DTO.IEditComment = req.body
      return successResponse(res, {
        msg: 'Comment has been modified Successfully',
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
        msg: 'Comment has been deleted successfully',
      })
    },
  )
}
