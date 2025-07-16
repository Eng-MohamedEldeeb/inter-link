import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { throwError } from '../../handlers/error-message.handler'

import { IGetGroup, IRemovePost } from '../../../modules/group/dto/group.dto'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import postRepository from '../../repositories/post.repository'

class PostExistenceInGroupGuard extends GuardActivator {
  private readonly postRepository = postRepository

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetGroup, IRemovePost>()
      const { _id: groupId, name } = req.group
      const { postId } = req.query

      const isExistedInGroup = await this.postRepository.findOne({
        filter: {
          $and: [
            { _id: postId },
            { onGroup: groupId },
            { archivedAt: { $exists: false } },
          ],
        },
      })

      if (!isExistedInGroup)
        return throwError({
          msg: `Post Doesn't exist in '${name}' group`,
          status: 404,
        })

      req.post = isExistedInGroup
      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetGroup & IRemovePost>()
      const { groupId, postId } = args

      const isExistedInGroup = await this.postRepository.findOne({
        filter: {
          $and: [
            { _id: postId },
            { onGroup: groupId },
            { archivedAt: { $exists: false } },
          ],
        },
      })

      if (!isExistedInGroup)
        return throwError({
          msg: `Post Doesn't exist in '${name}' group`,
          status: 404,
        })

      context.post = isExistedInGroup

      return true
    }
  }
}

export default new PostExistenceInGroupGuard()
