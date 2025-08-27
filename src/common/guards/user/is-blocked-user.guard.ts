import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { throwError } from '../../handlers/error-message.handler'
import { GuardActivator } from '../../decorators/guard/guard-activator.guard'
import { MongoId } from '../../types/db'
import { ContextType } from '../../decorators/context/types'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

class IsBlockedUserGuard extends GuardActivator {
  protected userId!: MongoId
  protected blockedUsers!: MongoId[]

  canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      const { blockedUsers } = req.profile
      const { _id: userId } = req.user

      this.userId = userId
      this.blockedUsers = blockedUsers

      const isBlockedUser = this.checkIfBlocked()

      if (isBlockedUser)
        return throwError({ msg: 'user not found', status: 404 })
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      const { blockedUsers } = context.profile
      const { _id: userId } = context.user

      this.userId = userId
      this.blockedUsers = blockedUsers

      const isBlockedUser = this.checkIfBlocked()

      if (isBlockedUser)
        return throwError({ msg: 'user not found', status: 404 })
    }

    return true
  }

  protected readonly checkIfBlocked = (): boolean => {
    if (this.blockedUsers.length) {
      const isBlockedUser = this.blockedUsers.some((blockedUserId: MongoId) =>
        blockedUserId.equals(this.userId),
      )
      return isBlockedUser
    }
    return false
  }
}

export default new IsBlockedUserGuard()
