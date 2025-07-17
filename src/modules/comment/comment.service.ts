import commentRepository from '../../common/repositories/comment.repository'

import * as DTO from './dto/comment.dto'

import { throwError } from '../../common/handlers/error-message.handler'

class CommentService {
  protected readonly commentRepository = commentRepository

  readonly addComment = async ({
    content,
    createdBy,
    attachment,
    postId,
  }: DTO.IAddComment) => {
    const postedComment = await this.commentRepository.create({
      content,
      ...(attachment.folderId && { attachment }),
      onPost: postId,
      createdBy,
    })

    return postedComment
  }

  readonly edit = async ({ id, content }: DTO.IEditComment) => {
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

  readonly deleteComment = async ({ id }: DTO.IDeleteComment) => {
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
}

export default new CommentService()
