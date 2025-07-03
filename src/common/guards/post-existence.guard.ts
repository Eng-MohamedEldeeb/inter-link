import { IGetSinglePostDTO } from '../../modules/post/dto/post.dto'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import { ContextType } from '../decorators/enums/async-handler.types'
import { throwHttpError } from '../handlers/http/error-message.handler'
import postRepository from '../repositories/post.repository'
import { GuardActivator } from './can-activate.guard'

class PostExistenceGuard extends GuardActivator {
  private readonly postRepository = postRepository

  async canActivate(...params: any[any]) {
    const ctx = ContextDetector.detect(params)

    if (ctx.type === ContextType.httpContext) {
      const { req } = ctx.switchToHTTP<IGetSinglePostDTO, IGetSinglePostDTO>()
      const { id } = { ...req.params, ...req.query }
      const isExistedPost = await this.postRepository.findOne({
        filter: { _id: id },
      })

      if (!isExistedPost)
        return throwHttpError({
          msg: 'In-Existent Post or In-valid Id',
          status: 404,
        })

      req.post = isExistedPost
      return true
    }
  }
}

export default new PostExistenceGuard()
