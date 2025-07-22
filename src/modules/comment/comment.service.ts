import commentRepository from '../../common/repositories/comment.repository'

import * as DTO from './dto/comment.dto'

import { throwError } from '../../common/handlers/error-message.handler'
import onlineUsersController from '../../common/services/notifications/online-users.controller'
import { IUser } from '../../db/interface/IUser.interface'
import { MongoId } from '../../common/types/db/db.types'

export class CommentService {
  protected static readonly commentRepository = commentRepository
  private static readonly onlineUsersController = onlineUsersController

  static readonly addComment = async ({
    content,
    createdBy,
    attachment,
    postId,
  }: DTO.IAddComment) => {
    await this.commentRepository.create({
      content,
      ...(attachment.folderId && { attachment }),
      onPost: postId,
      createdBy,
    })
  }

  static readonly edit = async ({ id, content }: DTO.IEditComment) => {
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

  static readonly deleteComment = async ({ id }: DTO.IDeleteComment) => {
    const deletedComment = await this.commentRepository.findByIdAndDelete({
      _id: id,
    })
    return (
      deletedComment ??
      throwError({
        msg: "In-valid Comment id or comment doesn't exist",
        status: 404,
      })
    )
  }

  static readonly like = async ({
    profile,
    commentId,
  }: {
    profile: IUser
    commentId: string
  }) => {
    const commentDoc = await this.commentRepository.findByIdAndUpdate({
      _id: commentId,
      data: { $addToSet: { likedBy: profile._id } },
      options: { lean: true, new: true, projection: {} },
    })

    // const id = this.onlineUsersController .get(commentDoc!.createdBy)

    // const notification: ICommentNotification = {
    //   title: `${profile.username} Liked Your Comment! ❤️`,
    //   from: profile,
    //   on
    //   refTo : 'Comment'
    // }

    // return { createdBy: commentDoc!.createdBy.toString()!, notification }
  }

  static readonly unlike = async ({
    profileId,
    commentId,
  }: {
    commentId: string
    profileId: MongoId
  }) => {
    await this.commentRepository.findByIdAndUpdate({
      _id: commentId,
      data: { $pull: { likedBy: profileId } },
    })
  }
}
