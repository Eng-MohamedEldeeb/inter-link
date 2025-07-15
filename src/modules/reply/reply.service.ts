import { throwError } from '../../common/handlers/error-message.handler'
import commentRepository from '../../common/repositories/comment.repository'
import { MongoId } from '../../common/types/db/db.types'
import { IAddReply, IDeleteReply, IEditReply } from './dto/reply.dto'

class ReplyService {
  protected readonly commentRepository = commentRepository

  readonly getCommentReplies = async (commentId: MongoId) => {
    const replies = await this.commentRepository.find({
      filter: { replyingTo: commentId },
    })
    return {
      replies,
      count: replies.length,
    }
  }

  readonly reply = async ({ content, createdBy, replyingTo }: IAddReply) => {
    const reply = await this.commentRepository.create({
      content,
      createdBy,
      replyingTo,
    })

    return reply
  }

  readonly edit = async ({ replyId, content }: IEditReply) => {
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

  readonly deleteReply = async ({ replyId }: IDeleteReply) => {
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
}

export default new ReplyService()
