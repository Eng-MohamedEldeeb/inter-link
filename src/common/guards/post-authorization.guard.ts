import { IGetSinglePostDTO } from '../../modules/post/dto/post.dto'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import {
  GraphQLParams,
  HttpParams,
} from '../decorators/context/types/context-detector.types'
import { ContextType } from '../decorators/context/types/enum/context-type.enum'
import { GuardActivator } from './can-activate.guard'

class PostAuthorizationGuard extends GuardActivator {
  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSinglePostDTO, IGetSinglePostDTO>()

      const { _id } = req.profile
      const { createdBy } = req.post

      if (!createdBy.equals(_id)) return false

      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL<IGetSinglePostDTO>()

      const { _id } = context.profile
      const { createdBy } = context.post

      if (!createdBy.equals(_id)) return false

      return true
    }
  }
}

export default new PostAuthorizationGuard()
