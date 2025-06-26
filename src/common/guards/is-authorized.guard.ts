import { IRequest } from '../interface/http/IRequest.interface'
import userRepository from '../repositories/user.repository'
import { GuardActivator } from './can-activate.guard'
import { IContext } from '../interface/graphql/IGraphQL.types'
import { throwGraphError } from '../handlers/graphql/error.handler'
import { ContextType } from '../decorators/types/async-handler.types'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import { GraphQLResolveInfo } from 'graphql'
import { NextFunction, Response } from 'express'
import { throwHttpError } from '../handlers/http/error-message.handler'

class IsAuthorizedGuard implements GuardActivator {
  private readonly userRepository = userRepository

  async canActivate(...params: any[any]) {
    const contextType = ContextDetector.detect(params)
    if (contextType === ContextType.httpContext) {
      const { req } = ContextDetector.switchToHTTP(params)

      const { _id, iat } = req.tokenPayload

      const isExistedUser = await this.userRepository.findById({
        _id,
        projection: { password: 0, oldPasswords: 0 },
        options: { lean: true },
      })

      if (!isExistedUser)
        return throwHttpError({ msg: 'un-authenticated user', status: 403 })

      if (
        iat &&
        iat < Math.ceil(isExistedUser.changedCredentialsAt?.getTime() / 1000)
      )
        return throwHttpError({ msg: 're-login is required', status: 403 })

      req.profile = isExistedUser

      return true
    }

    if (contextType === ContextType.graphContext) {
      const { context } = ContextDetector.switchToGraphQL(params)

      const { _id, iat } = context.tokenPayload

      const isExistedUser = await this.userRepository.findOne({
        filter: {
          _id,
          deactivatedAt: { $exists: false },
        },
        projection: { password: 0, oldPasswords: 0 },
        options: { lean: true },
      })

      if (!isExistedUser) return throwGraphError('un-authenticated user')

      if (
        iat &&
        iat < Math.ceil(isExistedUser.changedCredentialsAt?.getTime() / 1000)
      )
        return throwGraphError('re-login is required')

      context.profile = isExistedUser

      return context
    }
  }
}

export default new IsAuthorizedGuard()
