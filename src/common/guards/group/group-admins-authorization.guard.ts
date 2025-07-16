import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { MongoId } from '../../types/db/db.types'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import groupOwnerAuthorizationGuard from './group-owner-authorization.guard'

class GroupAdminAuthorizationGuard extends GuardActivator {
  protected profileId!: MongoId
  protected admins!: MongoId[]

  protected readonly isAdmin = () => {
    return this.admins.some(adminId => adminId.equals(this.profileId))
  }

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
      (await groupOwnerAuthorizationGuard.canActivate(...params))
    )
  }
}

export default new GroupAdminAuthorizationGuard()
