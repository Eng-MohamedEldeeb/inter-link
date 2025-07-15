import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import commentRepository from '../../repositories/comment.repository'
import {
  ICommentIdDTO,
  IGetSingleCommentDTO,
} from '../../../modules/comment/dto/comment.dto'

import { throwError } from '../../handlers/error-message.handler'

class PostExistenceGuard extends GuardActivator {
  private readonly commentRepository = commentRepository

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSingleCommentDTO & ICommentIdDTO>()
      const { id, commentId } = req.params

      const isExistedComment = await this.commentRepository.findOne({
        filter: { $or: [{ _id: id }, { _id: commentId }] },
        populate: [{ path: 'replies' }],
      })

      if (!isExistedComment)
        return throwError({
          msg: 'Un-Existed Comment or In-valid Id',
          status: 404,
        })

      req.comment = isExistedComment
      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetSingleCommentDTO>()
      const { id } = args

      const isExistedComment = await this.commentRepository.findOne({
        filter: { _id: id },
      })

      if (!isExistedComment)
        return throwError({
          msg: 'Un-Existed Comment or In-valid Id',
          status: 404,
        })

      context.comment = isExistedComment
      return true
    }
  }
}

export default new PostExistenceGuard()
