import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { throwError } from '../../handlers/error-message.handler'

import { IGetSinglePost, IPostId } from '../../../modules/post/dto/post.dto'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import postRepository from '../../repositories/post.repository'
import { MongoId } from '../../types/db/db.types'

class PostExistenceGuard extends GuardActivator {
  private readonly postRepository = postRepository
  protected postId!: MongoId
  protected id!: MongoId

  protected readonly isExistedPost = async () => {
    const isExistedPost = await this.postRepository.findOne({
      filter: {
        $and: [
          { $or: [{ _id: this.id }, { _id: this.postId }] },
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
    return isExistedPost
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<
        IGetSinglePost & IPostId,
        IGetSinglePost
      >()
      const { id, postId } = { ...req.params, ...req.query }

      this.postId = postId
      this.id = id

      req.post = await this.isExistedPost()

      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetSinglePost & IPostId>()
      const { id, postId } = args

      this.postId = postId
      this.id = id

      context.post = await this.isExistedPost()

      return true
    }
  }
}

export default new PostExistenceGuard()
