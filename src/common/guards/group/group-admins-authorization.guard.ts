import { GuardActivator } from '../class/guard-activator.class'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { MongoId } from '../../types/db'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

import GroupOwnerAuthorizationGuard from './group-owner-authorization.guard'

class GroupAdminAuthorizationGuard extends GuardActivator {
  protected profileId!: MongoId
  protected admins!: MongoId[]

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      const { admins } = req.group

      this.admins = admins
      this.profileId = req.profile._id
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      const { admins } = context.group

      this.admins = admins
      this.profileId = context.profile._id
    }

    return (
      this.isAdmin() ||
      (await GroupOwnerAuthorizationGuard.canActivate(...params))
    )
  }

  protected readonly isAdmin = () => {
    return this.admins.some(adminId => adminId.equals(this.profileId))
  }
}

export default new GroupAdminAuthorizationGuard()
