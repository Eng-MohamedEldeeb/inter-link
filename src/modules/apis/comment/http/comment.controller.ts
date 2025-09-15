import { Response } from "express"
import { IRequest } from "../../../../common/interface/IRequest.interface"
import { successResponse } from "../../../../common/handlers/success-response.handler"
import { asyncHandler } from "../../../../common/decorators/async-handler/async-handler.decorator"
import { MongoId } from "../../../../common/types/db"
import { IPostId } from "../../post/dto/post.dto"

import * as DTO from "../dto/comment.dto"

import commentService from "../comment.service"

class CommentController {
  private readonly commentService = commentService

  public readonly getSingle = asyncHandler(
    async (req: IRequest, res: Response) => {
      return successResponse(res, {
        data: req.comment,
      })
    },
  )

  public readonly addComment = asyncHandler(
    async (req: IRequest<IPostId>, res: Response) => {
      const attachment = req.cloudFile
      const { content }: Pick<DTO.IAddComment, "content"> = req.body

      await this.commentService.addComment({
        attachment,
        content,
        profile: req.profile,
        post: req.post,
      })

      return successResponse(res, {
        msg: "Comment added Successfully",
        status: 201,
      })
    },
  )

  public readonly like = asyncHandler(async (req: IRequest, res: Response) => {
    const { msg } = await this.commentService.like({
      profile: req.profile,
      comment: req.comment,
    })

    return successResponse(res, { msg })
  })

  public readonly edit = asyncHandler(
    async (req: IRequest<DTO.ICommentId>, res: Response) => {
      const { commentId } = req.params
      const { content }: DTO.IEditComment = req.body
      return successResponse(res, {
        msg: "Comment is modified Successfully",
        data: await this.commentService.edit({
          id: commentId,
          content,
        }),
      })
    },
  )

  public readonly deleteComment = asyncHandler(
    async (req: IRequest<{ commentId: MongoId }>, res: Response) => {
      const { commentId } = req.params
      await this.commentService.deleteComment({ id: commentId })
      return successResponse(res, {
        msg: "Comment is deleted successfully",
      })
    },
  )
}

export default new CommentController()
