import commentRepository from "../../common/repositories/comment.repository"
import notifyService from "../../common/services/notify/notify.service"

import * as DTO from "./dto/reply.dto"

import {
  ILikedCommentNotification,
  IReplyToCommentNotification,
} from "../../db/interfaces/INotification.interface"

import { throwError } from "../../common/handlers/error-message.handler"
import { MongoId } from "../../common/types/db"
import { IUser } from "../../db/interfaces/IUser.interface"
import { IReply } from "../../db/interfaces/IReply.interface"
import { getNowMoment } from "../../common/decorators/moment/moment"

class ReplyService {
  protected readonly commentRepository = commentRepository
  protected readonly notifyService = notifyService

  public readonly getCommentReplies = async (commentId: MongoId) => {
    const replies = await this.commentRepository.find({
      filter: { replyingTo: commentId },
    })
    return {
      replies,
      count: replies.length,
    }
  }

  public readonly reply = async ({
    content,
    profile,
    comment,
  }: DTO.IAddReply) => {
    const { _id: profileId, username, avatar } = profile
    const { _id: commentId, attachment, createdBy: commentCreator } = comment

    await this.commentRepository.create({
      content,
      createdBy: profileId,
      replyingTo: commentId,
    })

    const notification: IReplyToCommentNotification = {
      message: `${username} Replied To Your Comment 💬`,
      content,
      from: { _id: profileId, username, avatar },
      on: { _id: commentId, attachment },
      refTo: "Comment",
      sentAt: getNowMoment(),
    }

    this.notifyService.sendNotification({
      userId: commentCreator,
      notificationDetails: notification,
    })
  }

  public readonly like = async ({
    profile,
    reply,
  }: {
    profile: IUser
    reply: IReply
  }) => {
    const { _id: commentId, likedBy, createdBy } = reply
    const { _id: profileId, username, avatar } = profile

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
      return { msg: "Done" }
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
      message: `${username} Liked Your Reply 💚`,
      on: { _id: commentId },
      from: { _id: profileId, avatar, username },
      refTo: "Comment",
      sentAt: getNowMoment(),
    }

    this.notifyService.sendNotification({
      userId: createdBy,
      notificationDetails: notification,
    })

    return { msg: "comment is liked successfully" }
  }

  public readonly edit = async ({ replyId, content }: DTO.IEditReply) => {
    const updatedReply = await this.commentRepository.findByIdAndUpdate({
      _id: replyId,
      data: { content },
      options: { new: true, lean: true, projection: { content: 1 } },
    })
    return (
      updatedReply ??
      throwError({
        msg: "Invalid Reply id or Reply doesn't exist",
        status: 404,
      })
    )
  }

  public readonly deleteReply = async ({ replyId }: DTO.IDeleteReply) => {
    const isDeletedReply = await this.commentRepository.findByIdAndDelete({
      _id: replyId,
    })
    return (
      isDeletedReply ??
      throwError({
        msg: "Invalid Reply id or Reply doesn't exist",
        status: 404,
      })
    )
  }
}

export default new ReplyService()
