import { IGetSinglePostDTO } from '../../http/modules/post/dto/post.dto'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import { ContextType } from '../decorators/enums/async-handler.types'
import postRepository from '../repositories/post.repository'
import { GuardActivator } from './can-activate.guard'

class PostAuthorizationGuard extends GuardActivator {
  private readonly postRepository = postRepository

  async canActivate(...params: any[any]) {
    const ctx = ContextDetector.detect(params)

    if (ctx.type === ContextType.httpContext) {
      const { req } = ctx.switchToHTTP<IGetSinglePostDTO, IGetSinglePostDTO>()

      const { _id } = req.profile
      const { createdBy } = req.post

      if (!createdBy.equals(_id)) return false

      return true
    }
  }
}

export default new PostAuthorizationGuard()
