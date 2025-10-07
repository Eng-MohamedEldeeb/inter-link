import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { MongoId } from "../../types/db"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import communityOwnerGuard from "./community-owner.guard"

class InCommunityAdminsGuard extends GuardActivator {
  private profileId!: MongoId
  private admins!: MongoId[]

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      const { admins } = req.community
      console.log({ com: req.community })

      this.admins = admins
      this.profileId = req.profile._id
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      const { admins } = context.community

      this.admins = admins
      this.profileId = context.profile._id
    }

    return this.isAdmin() || communityOwnerGuard.canActivate(...params)
  }

  private readonly isAdmin = () => {
    return this.admins.some(adminId => adminId._id.equals(this.profileId))
  }
}

export default new InCommunityAdminsGuard()
