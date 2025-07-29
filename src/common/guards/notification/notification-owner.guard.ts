import { GuardActivator } from '../class/guard-activator.class'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { MongoId } from '../../types/db'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

class NotificationOwnerGuard extends GuardActivator {
  protected profileId!: MongoId
  protected belongsTo!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()
      const { _id: profileId } = req.profile
      const { belongsTo } = req.notifications

      this.profileId = profileId
      this.belongsTo = belongsTo
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()
      const { _id: profileId } = context.profile
      const { belongsTo } = context.notifications

      this.profileId = profileId
      this.belongsTo = belongsTo
    }

    return this.isTheOwner()
  }

  protected readonly isTheOwner = () => {
    return this.belongsTo.equals(this.profileId)
  }
}

export default new NotificationOwnerGuard()
