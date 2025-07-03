import userRepository from '../repositories/user.repository'
import { GuardActivator } from './can-activate.guard'
import { throwGraphError } from '../handlers/graphql/error.handler'
import { ContextType } from '../decorators/enums/async-handler.types'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import { throwHttpError } from '../handlers/http/error-message.handler'

class IsAuthorizedGuard implements GuardActivator {
  private readonly userRepository = userRepository

  async canActivate(...params: any[any]) {
    const ctx = ContextDetector.detect(params)

    if (ctx.type === ContextType.httpContext) {
      const { req } = ctx.switchToHTTP()

      const { _id, iat } = req.tokenPayload

      const isExistedUser = await this.userRepository.findOne({
        filter: { $and: [{ _id }, { deactivatedAt: { $exists: false } }] },
        projection: { password: 0, oldPasswords: 0 },
        options: { lean: true },
      })

      if (!isExistedUser)
        return throwHttpError({ msg: 'un-authenticated user', status: 403 })

      const isPassedTokenInitiationStamp =
        iat &&
        isExistedUser.changedCredentialsAt &&
        iat < Math.ceil(isExistedUser.changedCredentialsAt.getTime() / 1000)

      if (isPassedTokenInitiationStamp)
        return throwHttpError({ msg: 're-login is required', status: 403 })

      req.profile = isExistedUser

      return true
    }

    if (ctx.type === ContextType.graphContext) {
      const { context } = ctx.switchToGraphQL()

      const { _id, iat } = context.tokenPayload

      const isExistedUser = await this.userRepository.findOne({
        filter: { $and: [{ _id }, { deactivatedAt: { $exists: false } }] },
        projection: { password: 0, oldPasswords: 0 },
        populate: [{ path: 'posts' }],
        options: { lean: true },
      })

      if (!isExistedUser) return throwGraphError('un-authenticated user')

      const isPassedTokenInitiationStamp =
        iat &&
        isExistedUser.changedCredentialsAt &&
        iat < Math.ceil(isExistedUser.changedCredentialsAt.getTime() / 1000)

      if (isPassedTokenInitiationStamp)
        return throwGraphError('re-login is required')

      context.profile = isExistedUser

      return context
    }
  }
}

export default new IsAuthorizedGuard()
