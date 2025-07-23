import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { IReplyId } from '../../../modules/reply/dto/reply.dto'
import { throwError } from '../../handlers/error-message.handler'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import commentRepository from '../../repositories/comment.repository'

class ReplyExistenceGuard extends GuardActivator {
  private readonly commentRepository = commentRepository

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IReplyId>()
      const { replyId } = { ...req.params, ...req.query }

      const isExistedReply = await this.commentRepository.findOne({
        filter: { _id: replyId },
        projection: { savedBy: 0 },
      })

      if (!isExistedReply)
        return throwError({
          msg: 'Un-Existed Reply or In-valid Id',
          status: 404,
        })

      req.reply = isExistedReply
      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IReplyId>()
      const { replyId } = args

      const isExistedReply = await this.commentRepository.findOne({
        filter: { _id: replyId },
      })

      if (!isExistedReply)
        return throwError({
          msg: 'Un-Existed Post or In-valid Id',
          status: 404,
        })

      context.reply = isExistedReply
      return true
    }
  }
}

export default new ReplyExistenceGuard()
