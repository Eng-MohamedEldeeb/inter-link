import { throwError } from '../../common/handlers/error-message.handler'
import { MongoId } from '../../common/types/db/db.types'
import { IUser } from '../../db/interface/IUser.interface'
import {
  ILikedCommentNotification,
  IReplyToCommentNotification,
} from '../../db/interface/INotification.interface'

import * as DTO from './dto/reply.dto'

import commentRepository from '../../common/repositories/comment.repository'
import notificationsService from '../../common/services/notifications/notifications.service'
import { IReply } from '../../db/interface/IReply.interface'

export class ReplyService {
  private static readonly commentRepository = commentRepository
  private static readonly notificationsService = notificationsService

  static readonly getCommentReplies = async (commentId: MongoId) => {
    const replies = await this.commentRepository.find({
      filter: { replyingTo: commentId },
    })
    return {
      replies,
      count: replies.length,
    }
  }

  static readonly reply = async ({
    content,
    profile,
    comment,
  }: DTO.IAddReply) => {
    const { _id: profileId, username, fullName, avatar } = profile
    const { _id: commentId, attachment, createdBy: commentCreator } = comment

    await this.commentRepository.create({
      content,
      createdBy: profileId,
      replyingTo: commentId,
    })

    const notification: IReplyToCommentNotification = {
      title: `${username} Replied To Your Comment 💬`,
      content,
      from: { _id: profileId, username, fullName, avatar },
      on: { _id: commentId, attachment },
      refTo: 'Comment',
    }

    await this.notificationsService.sendNotification({
      toUser: commentCreator,
      notificationDetails: notification,
    })
  }

  static readonly like = async ({
    profile,
    reply,
  }: {
    profile: IUser
    reply: IReply
  }) => {
    const { _id: commentId, likedBy, createdBy } = reply
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
      title: `${username} Liked Your Reply 💚`,
      on: { _id: commentId },
      from: { _id: profileId, avatar, fullName, username },
      refTo: 'Comment',
    }

    await this.notificationsService.sendNotification({
      toUser: createdBy,
      notificationDetails: notification,
    })

    return { msg: 'comment is liked successfully' }
  }

  static readonly edit = async ({ replyId, content }: DTO.IEditReply) => {
    const updatedReply = await this.commentRepository.findByIdAndUpdate({
      _id: replyId,
      data: { content },
      options: { new: true, lean: true, projection: { content: 1 } },
    })
    return (
      updatedReply ??
      throwError({
        msg: "In-valid Reply id or Reply doesn't exist",
        status: 404,
      })
    )
  }

  static readonly deleteReply = async ({ replyId }: DTO.IDeleteReply) => {
    const deletedReply = await this.commentRepository.findByIdAndDelete({
      _id: replyId,
    })
    return (
      deletedReply ??
      throwError({
        msg: "In-valid Reply id or Reply doesn't exist",
        status: 404,
      })
    )
  }
}
