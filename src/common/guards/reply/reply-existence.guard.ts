import { MongoId } from '../../types/db'
import { GuardActivator } from '../class/guard-activator.class'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { IReplyId } from '../../../modules/reply/dto/reply.dto'
import { throwError } from '../../handlers/error-message.handler'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

import commentRepository from '../../repositories/comment.repository'

class ReplyExistenceGuard extends GuardActivator {
  protected readonly commentRepository = commentRepository
  protected replyId!: MongoId

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

  protected readonly getReplyDetails = async () => {
    const isExistedReply = await this.commentRepository.findOne({
      filter: { _id: this.replyId },
      projection: { savedBy: 0 },
    })

    if (!isExistedReply)
      return throwError({
        msg: 'Un-Existed Reply or In-valid Id',
        status: 404,
      })

    return isExistedReply
  }
}

export default new ReplyExistenceGuard()
