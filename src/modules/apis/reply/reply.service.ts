import { Notify } from "../../../common/services/notify/notify.event"

import * as DTO from "./dto/reply.dto"

import { throwError } from "../../../common/handlers/error-message.handler"
import { MongoId } from "../../../common/types/db"
import { IUser } from "../../../db/interfaces/IUser.interface"
import { IReply } from "../../../db/interfaces/IReply.interface"
import { currentMoment } from "../../../common/decorators/moment/moment"
import { commentRepository } from "../../../db/repositories"
import { InteractionType } from "../../../db/interfaces/INotification.interface"

class ReplyService {
  private readonly commentRepository = commentRepository
  private readonly Notify = Notify

  public readonly getCommentReplies = async (commentId: MongoId) => {
    const replies = await this.commentRepository.find({
      filter: { replyingTo: commentId },
    })
    return {
      replies,
      count: replies.length,
    }
  }

  public readonly reply = async ({ body, profile, comment }: DTO.IAddReply) => {
    const { _id: profileId, username } = profile
    const { _id: commentId, createdBy: commentCreator } = comment

    await this.commentRepository.create({
      body,
      createdBy: profileId,
      replyingTo: commentId,
    })

    // return this.Notify.sendNotification({
    //   sender: profile,
    //   receiverId: commentCreator,
    //   body: {
    //     message: `${username} Replied To You 💬`,
    //     sentAt: currentMoment(),
    //     refTo: InteractionType.Comment,
    //     relatedTo: commentId,
    //   },
    // })
  }

  public readonly like = async ({
    profile,
    reply,
  }: {
    profile: IUser
    reply: IReply
  }) => {
    const { _id: commentId, likedBy, createdBy } = reply
    const { _id: profileId, username } = profile

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

    // this.Notify.sendNotification({
    //   sender: profile,
    //   receiverId: createdBy,
    //   body: {
    //     message: `${username} Liked Your Reply 💚`,
    //     sentAt: currentMoment(),
    //     refTo: InteractionType.Comment,
    //     relatedTo: commentId,
    //   },
    // })

    return { msg: "comment is liked successfully" }
  }

  public readonly edit = async ({ replyId, body }: DTO.IEditReply) => {
    const updatedReply = await this.commentRepository.findByIdAndUpdate({
      _id: replyId,
      data: { body },
      options: { new: true, lean: true, projection: { body: 1 } },
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
