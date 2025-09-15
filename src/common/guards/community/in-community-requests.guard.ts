import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { MongoId } from "../../types/db"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import communityOwnerGuard from "./community-owner.guard"

class CommunityRequestsGuard extends GuardActivator {
  private userId!: MongoId
  private requests!: MongoId[]

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      const { requests } = req.community
      const { _id: userId } = req.user

      this.requests = requests
      this.userId = userId
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      const { requests } = context.community
      const { _id: userId } = context.user

      this.requests = requests
      this.userId = userId
    }

    return (
      this.hasRequested() || (await communityOwnerGuard.canActivate(...params))
    )
  }

  private readonly hasRequested = () => {
    return this.requests.some(userId => userId.equals(this.userId))
  }
}

export default new CommunityRequestsGuard()
