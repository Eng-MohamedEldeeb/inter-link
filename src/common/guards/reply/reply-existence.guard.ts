import { MongoId } from "../../types/db"
import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { IReplyId } from "../../../modules/apis/reply/dto/reply.dto"
import { throwError } from "../../handlers/error-message.handler"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import { commentRepository } from "../../../db/repositories"

class ReplyExistenceGuard extends GuardActivator {
  private readonly commentRepository = commentRepository
  private replyId!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IReplyId>()
      const { replyId } = { ...req.params, ...req.query }

      this.replyId = replyId

      req.reply = await this.getReplyDetails()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IReplyId>()
      const { replyId } = args

      this.replyId = replyId

      context.reply = await this.getReplyDetails()
    }

    return true
  }

  private readonly getReplyDetails = async () => {
    const isExistedReply = await this.commentRepository.findOne({
      filter: { _id: this.replyId },
      projection: { savedBy: 0 },
    })

    if (!isExistedReply)
      return throwError({
        msg: "Un-Existed Reply or Invalid Id",
        status: 404,
      })

    return isExistedReply
  }
}

export default new ReplyExistenceGuard()
