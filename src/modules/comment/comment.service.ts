import notifyService from "../../common/services/notify/notify.service"

import * as DTO from "./dto/comment.dto"

import {
  ICommentedOnPostNotification,
  ILikedCommentNotification,
} from "../../db/interfaces/INotification.interface"

import { throwError } from "../../common/handlers/error-message.handler"
import { IUser } from "../../db/interfaces/IUser.interface"
import { IComment } from "../../db/interfaces/IComment.interface"
import { currentMoment } from "../../common/decorators/moment/moment"
import { commentRepository } from "../../common/repositories"

class CommentService {
  private readonly commentRepository = commentRepository
  private readonly notifyService = notifyService

  public readonly addComment = async ({
    content,
    attachment,
    post,
    profile,
  }: DTO.IAddComment) => {
    const { _id: profileId, avatar, username } = profile
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
      from: { _id: profileId, avatar, username },
      on: { _id: postId, attachments },
      refTo: "Post",
      sentAt: currentMoment(),
    }

    this.notifyService.sendNotification({
      userId: createdBy,
      notificationDetails: notification,
    })
  }

  public readonly like = async ({
    profile,
    comment,
  }: {
    profile: IUser
    comment: IComment
  }) => {
    const { _id: commentId, likedBy, createdBy, attachment } = comment
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
      message: `${username} Liked Your Comment 💚`,
      on: { _id: commentId, attachment },
      from: { _id: profileId, avatar, username },
      refTo: "Comment",
      sentAt: currentMoment(),
    }

    this.notifyService.sendNotification({
      userId: createdBy,
      notificationDetails: notification,
    })

    return { msg: "comment is liked successfully" }
  }

  public readonly edit = async ({ id, content }: DTO.IEditComment) => {
    const updatedComment = await this.commentRepository.findByIdAndUpdate({
      _id: id,
      data: { content },
      options: { new: true, lean: true, projection: { content: 1 } },
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
