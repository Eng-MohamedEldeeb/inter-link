import { throwError } from '../../common/handlers/error-message.handler'
import commentRepository from '../../common/repositories/comment.repository'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { MongoId } from '../../common/types/db/db.types'
import {
  IAddCommentDTO,
  IDeleteCommentDTO,
  IEditCommentDTO,
  IGetPostCommentsDTO,
} from './dto/comment.dto'

class CommentService {
  protected readonly commentRepository = commentRepository

  readonly addComment = async ({
    content,
    createdBy,
    attachment,
    postId,
  }: IAddCommentDTO & IGetPostCommentsDTO & { attachment: ICloudFile }) => {
    const postedComment = await this.commentRepository.create({
      content,
      ...(attachment.folderId && { attachment }),
      onPost: postId,
      createdBy,
    })

    return postedComment
  }

  readonly edit = async ({ commentId, content }: IEditCommentDTO) => {
    const updatedComment = await this.commentRepository.findByIdAndUpdate({
      _id: commentId,
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

  readonly deleteComment = async ({ commentId }: IDeleteCommentDTO) => {
    const deletedComment = await this.commentRepository.findByIdAndDelete({
      _id: commentId,
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
