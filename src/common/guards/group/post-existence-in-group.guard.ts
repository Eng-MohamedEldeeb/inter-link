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
import { MongoId } from '../../types/db/db.types'

class PostExistenceInGroupGuard extends GuardActivator {
  private readonly postRepository = postRepository
  protected groupName!: string
  protected groupId!: MongoId
  protected postId!: MongoId

  protected readonly checkPostInGroup = async () => {
    const isExistedInGroup = await this.postRepository.findOne({
      filter: {
        $and: [
          { _id: this.postId },
          { onGroup: this.groupId },
          { archivedAt: { $exists: false } },
        ],
      },
    })

    if (!isExistedInGroup)
      return throwError({
        msg: `Post Doesn't exist in '${this.groupName}' group`,
        status: 404,
      })
    return isExistedInGroup
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetGroup, IRemovePost>()
      const { _id: groupId, name } = req.group
      const { postId } = req.query

      this.groupName = name
      this.groupId = groupId
      this.postId = postId

      const post = await this.checkPostInGroup()

      req.post = post

      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetGroup & IRemovePost>()
      const { _id: groupId, name } = context.group
      const { postId } = args

      this.groupName = name
      this.groupId = groupId
      this.postId = postId

      const post = await this.checkPostInGroup()

      context.post = post

      return true
    }
  }
}

export default new PostExistenceInGroupGuard()
