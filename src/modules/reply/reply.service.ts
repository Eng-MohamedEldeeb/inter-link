import moment from 'moment'
import commentRepository from '../../common/repositories/comment.repository'
import notificationsService from '../../common/services/notifications/notifications.service'

import * as DTO from './dto/reply.dto'

import {
  ILikedCommentNotification,
  IReplyToCommentNotification,
} from '../../db/interfaces/INotification.interface'

import { throwError } from '../../common/handlers/error-message.handler'
import { MongoId } from '../../common/types/db'
import { IUser } from '../../db/interfaces/IUser.interface'
import { IReply } from '../../db/interfaces/IReply.interface'

export class ReplyService {
  protected static readonly commentRepository = commentRepository
  protected static readonly notificationsService = notificationsService

  public static readonly getCommentReplies = async (commentId: MongoId) => {
    const replies = await this.commentRepository.find({
      filter: { replyingTo: commentId },
    })
    return {
      replies,
      count: replies.length,
    }
  }

  public static readonly reply = async ({
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
      notificationMessage: `${username} Replied To Your Comment 💬`,
      content,
      from: { _id: profileId, username, fullName, avatar },
      on: { _id: commentId, attachment },
      refTo: 'Comment',
      sentAt: moment().format('h:mm A'),
    }

    await this.notificationsService.sendNotification({
      userId: commentCreator,
      notificationDetails: notification,
    })
  }

  public static readonly like = async ({
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
      notificationMessage: `${username} Liked Your Reply 💚`,
      on: { _id: commentId },
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

  public static readonly edit = async ({
    replyId,
    content,
  }: DTO.IEditReply) => {
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

  public static readonly deleteReply = async ({
    replyId,
  }: DTO.IDeleteReply) => {
    const isDeletedReply = await this.commentRepository.findByIdAndDelete({
      _id: replyId,
    })
    return (
      isDeletedReply ??
      throwError({
        msg: "In-valid Reply id or Reply doesn't exist",
        status: 404,
      })
    )
  }
}
