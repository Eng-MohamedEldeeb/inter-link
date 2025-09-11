import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { throwError } from "../../handlers/error-message.handler"
import { MongoId } from "../../types/db"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import {
  ICommentId,
  IGetSingleComment,
} from "../../../modules/comment/dto/comment.dto"

import commentRepository from "../../repositories/comment.repository"

class CommentExistenceGuard extends GuardActivator {
  private readonly commentRepository = commentRepository
  private id: MongoId | undefined = undefined
  private commentId: MongoId | undefined = undefined

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSingleComment & ICommentId>()

      const { id, commentId } = { ...req.params, ...req.query }

      this.id = id
      this.commentId = commentId

      req.comment = await this.getCommentDetails()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<
        IGetSingleComment & ICommentId
      >()
      const { id, commentId } = args

      this.id = id
      this.commentId = commentId

      context.comment = await this.getCommentDetails()
    }

    return true
  }

  private readonly getCommentDetails = async () => {
    const isExistedComment = await this.commentRepository.findOne({
      filter: { $or: [{ _id: this.id }, { _id: this.commentId }] },
      populate: [{ path: "replies" }],
    })

    if (!isExistedComment)
      return throwError({
        msg: "Un-Existed Comment or Invalid Id",
        status: 404,
      })

    return isExistedComment
  }
}

export default new CommentExistenceGuard()
