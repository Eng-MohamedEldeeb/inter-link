import { GuardActivator } from '../class/guard-activator.class'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { throwError } from '../../handlers/error-message.handler'

import { IGetGroup, IRemovePost } from '../../../modules/group/dto/group.dto'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

import postRepository from '../../repositories/post.repository'
import { MongoId } from '../../types/db'

class PostExistenceInGroupGuard extends GuardActivator {
  protected readonly postRepository = postRepository
  protected groupName!: string
  protected groupId!: MongoId
  protected postId!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetGroup, IRemovePost>()
      const { _id: groupId, name } = req.group
      const { postId } = req.query

      this.groupName = name
      this.groupId = groupId
      this.postId = postId

      req.post = await this.getPostFromGroup()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetGroup & IRemovePost>()
      const { _id: groupId, name } = context.group
      const { postId } = args

      this.groupName = name
      this.groupId = groupId
      this.postId = postId

      context.post = await this.getPostFromGroup()
    }

    return true
  }

  protected readonly getPostFromGroup = async () => {
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
}

export default new PostExistenceInGroupGuard()
