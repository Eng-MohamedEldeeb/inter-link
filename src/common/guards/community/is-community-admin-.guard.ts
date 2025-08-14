import { GuardActivator } from '../class/guard-activator.class'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { MongoId } from '../../types/db'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

import communityOwnerAuthorizationGuard from './community-owner-authorization.guard'

class CommunityAdminGuard extends GuardActivator {
  protected profileId!: MongoId
  protected admins!: MongoId[]

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      const { admins } = req.community

      this.admins = admins
      this.profileId = req.profile._id
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      const { admins } = context.community

      this.admins = admins
      this.profileId = context.profile._id
    }

    return (
      this.isAdmin() ||
      (await communityOwnerAuthorizationGuard.canActivate(...params))
    )
  }

  protected readonly isAdmin = () => {
    return this.admins.some(adminId => adminId.equals(this.profileId))
  }
}

export default new CommunityAdminGuard()
