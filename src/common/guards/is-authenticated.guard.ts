import { verifyToken } from '../utils/security/token/token.service'
import { GuardActivator } from './can-activate.guard'
import { throwGraphError } from '../handlers/graphql/error.handler'
import { ContextType } from '../decorators/types/async-handler.types'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import { throwHttpError } from '../handlers/http/error-message.handler'

class IsAuthenticatedGuard implements GuardActivator {
  async canActivate(...params: any[any]) {
    const contextType = ContextDetector.detect(params)

    if (contextType === ContextType.httpContext) {
      const { req, next } = ContextDetector.switchToHTTP(params)

      const { authorization } = req.headers

      if (!authorization)
        return throwHttpError({ msg: 'missing token', status: 400 })

      const [bearer, token] = authorization.split(' ')

      if (!bearer || !token)
        return throwHttpError({ msg: 'missing token', status: 400 })

      const tokenPayload = verifyToken(token)

      req.tokenPayload = tokenPayload

      return true
    }

    if (contextType === ContextType.graphContext) {
      const { context } = ContextDetector.switchToGraphQL(params)

      const { authorization } = context

      if (!authorization) return throwGraphError('missing token')

      const [bearer, token] = authorization.split(' ')

      if (!bearer || !token) return throwGraphError('missing bearer token')

      const tokenPayload = verifyToken(token)

      context.tokenPayload = tokenPayload

      return context
    }

    return false
  }
}

export default new IsAuthenticatedGuard()
