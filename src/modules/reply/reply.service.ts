import commentRepository from '../../common/repositories/comment.repository'

import * as DTO from './dto/reply.dto'

import { throwError } from '../../common/handlers/error-message.handler'
import { MongoId } from '../../common/types/db/db.types'
import onlineUsersController from '../../common/services/notifications/online-users.controller'

import { IUser } from '../../db/interface/IUser.interface'
import { INotificationDetails } from '../../db/interface/INotification.interface'

export class ReplyService {
  protected static readonly commentRepository = commentRepository
  private static readonly onlineUsersController = onlineUsersController

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
    createdBy,
    replyingTo,
  }: DTO.IAddReply) => {
    const reply = await this.commentRepository.create({
      content,
      createdBy,
      replyingTo,
    })

    return reply
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

  static readonly like = async ({
    profile,
    replyId,
  }: {
    profile: IUser
    replyId: string
  }) => {
    await this.commentRepository.findByIdAndUpdate({
      _id: replyId,
      data: { $addToSet: { likedBy: profile._id } },
      options: { lean: true, new: true, projection: {} },
    })
  }

  static readonly unlike = async ({
    profileId,
    replyId,
  }: {
    replyId: string
    profileId: MongoId
  }) => {
    await this.commentRepository.findByIdAndUpdate({
      _id: replyId,
      data: { $pull: { likedBy: profileId } },
    })
  }
}
