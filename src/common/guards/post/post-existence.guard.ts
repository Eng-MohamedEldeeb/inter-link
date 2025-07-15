import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import postRepository from '../../repositories/post.repository'
import { IGetPostComments } from '../../../modules/comment/dto/comment.dto'
import { IGetSinglePost } from '../../../modules/post/dto/post.dto'

import { throwError } from '../../handlers/error-message.handler'

class PostExistenceGuard extends GuardActivator {
  private readonly postRepository = postRepository

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<
        IGetSinglePost & IGetPostComments,
        IGetSinglePost
      >()
      const { id, postId } = { ...req.params, ...req.query }

      const isExistedPost = await this.postRepository.findOne({
        filter: {
          $and: [
            { $or: [{ _id: id }, { _id: postId }] },
            { archivedAt: { $exists: false } },
          ],
        },
        projection: { savedBy: 0 },
        populate: [{ path: 'comments' }],
      })

      if (!isExistedPost)
        return throwError({
          msg: 'Un-Existed Post or In-valid Id',
          status: 404,
        })

      req.post = isExistedPost
      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetSinglePost>()
      const { id } = args
      const isExistedPost = await this.postRepository.findOne({
        filter: { $and: [{ _id: id }, { archivedAt: { $exists: false } }] },
        populate: [{ path: 'comments' }],
      })

      if (!isExistedPost)
        return throwError({
          msg: 'Un-Existed Post or In-valid Id',
          status: 404,
        })

      context.post = isExistedPost
      return true
    }
  }
}

export default new PostExistenceGuard()
