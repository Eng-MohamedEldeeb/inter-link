import commentRepository from '../../common/repositories/comment.repository'
import notificationsService from '../../common/services/notifications/notifications.service'

import * as DTO from './dto/comment.dto'

import {
  ICommentedOnPostNotification,
  ILikedCommentNotification,
} from '../../db/interfaces/INotification.interface'

import { throwError } from '../../common/handlers/error-message.handler'
import { IUser } from '../../db/interfaces/IUser.interface'
import { IComment } from '../../db/interfaces/IComment.interface'
import moment from 'moment'

export class CommentService {
  protected static readonly commentRepository = commentRepository
  protected static readonly notificationsService = notificationsService

  public static readonly addComment = async ({
    content,
    attachment,
    post,
    profile,
  }: DTO.IAddComment) => {
    const { _id: profileId, avatar, username, fullName } = profile
    const { _id: postId, createdBy, attachments } = post

    await this.commentRepository.create({
      content,
      ...(attachment.folderId && { attachment }),
      onPost: postId,
      createdBy: profileId,
    })

    const notification: ICommentedOnPostNotification = {
      message: `${username} Commented On Your Post! 💬`,
      content,
      from: { _id: profileId, avatar, username, fullName },
      on: { _id: postId, attachments },
      refTo: 'Post',
      sentAt: moment().format('h:mm A'),
    }

    await this.notificationsService.sendNotification({
      userId: createdBy,
      notificationDetails: notification,
    })
  }

  public static readonly like = async ({
    profile,
    comment,
  }: {
    profile: IUser
    comment: IComment
  }) => {
    const { _id: commentId, likedBy, createdBy, attachment } = comment
    const { _id: profileId, username, avatar, fullName } = profile

    const isAlreadyLiked = likedBy.some(userId => userId.equals(profileId))

    if (isAlreadyLiked) {
      await this.commentRepository.findByIdAndUpdate({
        _id: commentId,
        data: { $pull: { likedBy: profileId } },
        options: {
          lean: true,
          new: true,
        },
      })
      return { msg: 'Done' }
    }

    await this.commentRepository.findByIdAndUpdate({
      _id: commentId,
      data: { $addToSet: { likedBy: profile._id } },
      options: {
        lean: true,
        new: true,
      },
    })

    const notification: ILikedCommentNotification = {
      message: `${username} Liked Your Comment 💚`,
      on: { _id: commentId, attachment },
      from: { _id: profileId, avatar, fullName, username },
      refTo: 'Comment',
      sentAt: moment().format('h:mm A'),
    }

    await this.notificationsService.sendNotification({
      userId: createdBy,
      notificationDetails: notification,
    })

    return { msg: 'comment is liked successfully' }
  }

  public static readonly edit = async ({ id, content }: DTO.IEditComment) => {
    const updatedComment = await this.commentRepository.findByIdAndUpdate({
      _id: id,
      data: { content },
      options: { new: true, lean: true, projection: { content: 1 } },
    })
    return (
      updatedComment ??
      throwError({
        msg: "In-valid Comment id or comment doesn't exist",
        status: 404,
      })
    )
  }

  public static readonly deleteComment = async ({ id }: DTO.IDeleteComment) => {
    const isDeletedComment = await this.commentRepository.findByIdAndDelete({
      _id: id,
    })
    return (
      isDeletedComment ??
      throwError({
        msg: "In-valid Comment id or comment doesn't exist",
        status: 404,
      })
    )
  }
}
