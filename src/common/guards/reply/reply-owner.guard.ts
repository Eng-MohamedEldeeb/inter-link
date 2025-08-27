import { GuardActivator } from '../../decorators/guard/guard-activator.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { MongoId } from '../../types/db'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

class ReplyOwnerGuard extends GuardActivator {
  protected profileId!: MongoId
  protected createdBy!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      this.createdBy = req.reply.createdBy
      this.profileId = req.profile._id
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      this.createdBy = context.post.createdBy
      this.profileId = context.profile._id
    }

    return this.isTheOwner()
  }

  protected readonly isTheOwner = async () => {
    return this.createdBy.equals(this.profileId)
  }
}

export default new ReplyOwnerGuard()
