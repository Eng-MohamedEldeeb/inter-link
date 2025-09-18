import * as DTO from "./dto/comment.dto"

import { Notify } from "../../../common/services/notify/notify.event"
import { throwError } from "../../../common/handlers/error-message.handler"
import { IUser } from "../../../db/interfaces/IUser.interface"
import { IComment } from "../../../db/interfaces/IComment.interface"
import { currentMoment } from "../../../common/decorators/moment/moment"
import { commentRepository } from "../../../db/repositories"
import { NotificationRefTo } from "../../../db/interfaces/INotification.interface"

class CommentService {
  private readonly commentRepository = commentRepository
  private readonly Notify = Notify

  public readonly addComment = async ({
    body,
    attachment,
    post,
    profile,
  }: DTO.IAddComment) => {
    const { _id: profileId, username } = profile
    const { _id: postId, createdBy } = post

    await this.commentRepository.create({
      body,
      ...(attachment.folderId && { attachment }),
      onPost: postId,
      createdBy: profileId,
    })

    return this.Notify.sendNotification({
      sender: profile,
      receiverId: createdBy,
      body: {
        message: `${username} Add a Comment 💬`,
        sentAt: currentMoment(),
        refTo: NotificationRefTo.Post,
        relatedTo: postId,
      },
    })
  }

  public readonly like = async ({
    profile,
    comment,
  }: {
    profile: IUser
    comment: IComment
  }) => {
    const { _id: commentId, likedBy, createdBy } = comment
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

    this.Notify.sendNotification({
      sender: profile,
      receiverId: createdBy,
      body: {
        message: `${username} Liked Your Comment 💚`,
        sentAt: currentMoment(),
        refTo: NotificationRefTo.Comment,
        relatedTo: commentId,
      },
    })

    return { msg: "comment is liked successfully" }
  }

  public readonly edit = async ({ id, body }: DTO.IEditComment) => {
    const updatedComment = await this.commentRepository.findByIdAndUpdate({
      _id: id,
      data: { body },
      options: { new: true, lean: true, projection: { body: 1 } },
    })
    return (
      updatedComment ??
      throwError({
        msg: "Invalid Comment id or comment doesn't exist",
        status: 404,
      })
    )
  }

  public readonly deleteComment = async ({ id }: DTO.IDeleteComment) => {
    const isDeletedComment = await this.commentRepository.findByIdAndDelete({
      _id: id,
    })
    return (
      isDeletedComment ??
      throwError({
        msg: "Invalid Comment id or comment doesn't exist",
        status: 404,
      })
    )
  }
}

export default new CommentService()
