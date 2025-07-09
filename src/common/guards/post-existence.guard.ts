import { IGetSinglePostDTO } from '../../modules/post/dto/post.dto'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import {
  GraphQLParams,
  HttpParams,
} from '../decorators/context/types/context-detector.types'
import { ContextType } from '../decorators/context/types/enum/context-type.enum'
import { throwError } from '../handlers/error-message.handler'
import postRepository from '../repositories/post.repository'
import { GuardActivator } from './can-activate.guard'

class PostExistenceGuard extends GuardActivator {
  private readonly postRepository = postRepository

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSinglePostDTO, IGetSinglePostDTO>()
      const { id } = { ...req.params, ...req.query }
      const isExistedPost = await this.postRepository.findOne({
        filter: { _id: id },
      })

      if (!isExistedPost)
        return throwError({
          msg: 'In-Existent Post or In-valid Id',
          status: 404,
        })

      req.post = isExistedPost
      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetSinglePostDTO>()
      const { id } = args
      const isExistedPost = await this.postRepository.findOne({
        filter: { $and: [{ _id: id }, { archivedAt: { $exists: false } }] },
      })

      if (!isExistedPost)
        return throwError({
          msg: 'In-Existent Post or In-valid Id',
          status: 404,
        })

      context.post = isExistedPost
      return true
    }
  }
}

export default new PostExistenceGuard()
