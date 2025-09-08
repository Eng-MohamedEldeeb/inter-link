import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { MongoId } from "../../types/db"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

class InCommunityMembersGuard extends GuardActivator {
  private userId!: MongoId
  private members!: MongoId[]

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      const { members } = req.community
      const { _id: userId } = req.user

      this.members = members
      this.userId = userId
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      const { members } = context.community
      const { _id: userId } = context.user

      this.members = members
      this.userId = userId
    }

    return this.isExistedMember()
  }

  private readonly isExistedMember = () => {
    return this.members.some(userId => userId.equals(this.userId))
  }
}

export default new InCommunityMembersGuard()
