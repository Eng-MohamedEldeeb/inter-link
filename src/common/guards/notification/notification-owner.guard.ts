import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { MongoId } from "../../types/db"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

class NotificationOwnerGuard extends GuardActivator {
  private profileId!: MongoId
  private receiver!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()
      const { _id: profileId } = req.profile
      const { receiver } = req.notification

      this.profileId = profileId
      this.receiver = receiver
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()
      const { _id: profileId } = context.profile
      const { receiver } = context.notifications

      this.profileId = profileId
      this.receiver = receiver
    }

    return this.isTheOwner()
  }

  private readonly isTheOwner = () => {
    return this.receiver.equals(this.profileId)
  }
}

export default new NotificationOwnerGuard()
