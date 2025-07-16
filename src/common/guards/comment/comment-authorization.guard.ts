import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { MongoId } from '../../types/db/db.types'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

class CommentAuthorizationGuard extends GuardActivator {
  protected profileId!: MongoId
  protected createdBy!: MongoId

  protected readonly isTheOwner = async () => {
    return this.createdBy.equals(this.profileId)
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      this.createdBy = req.comment.createdBy
      this.profileId = req.profile._id

      return this.isTheOwner()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      this.createdBy = context.comment.createdBy
      this.profileId = context.profile._id

      return this.isTheOwner()
    }
  }
}

export default new CommentAuthorizationGuard()
