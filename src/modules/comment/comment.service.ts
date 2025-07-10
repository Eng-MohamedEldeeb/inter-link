import { throwError } from '../../common/handlers/error-message.handler'
import commentRepository from '../../common/repositories/comment.repository'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { MongoId } from '../../common/types/db/db.types'
import {
  IAddCommentDTO,
  IEditCommentDTO,
  IGetPostCommentsDTO,
} from './dto/comment.dto'

class CommentService {
  protected readonly commentRepository = commentRepository

  readonly getPostComments = async (postId: MongoId) => {
    const comments = await this.commentRepository.find({
      filter: { onPost: postId },
    })

    return {
      comments,
      count: comments.length,
    }
  }

  readonly addComment = async ({
    content,
    createdBy,
    attachment,
    postId,
  }: IAddCommentDTO & IGetPostCommentsDTO & { attachment: ICloudFile }) => {
    const postedComment = await this.commentRepository.create({
      content,
      ...(attachment && { attachment }),
      onPost: postId,
      createdBy,
    })

    return postedComment
  }

  readonly edit = async ({
    commentId,
    editCommentDTO,
  }: {
    commentId: MongoId
    editCommentDTO: IEditCommentDTO
  }) => {
    const updatedComment = await this.commentRepository.findByIdAndUpdate({
      _id: commentId,
      data: editCommentDTO,
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

  readonly deleteComment = async (commentId: MongoId) => {
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
