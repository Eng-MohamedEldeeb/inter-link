import { verifyToken } from '../../utils/security/token/token.service'
import { GuardActivator } from '../can-activate.guard'
import { throwError } from '../../handlers/error-message.handler'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'
import { IContext } from '../../decorators/resolver/types/IGraphQL.interface'
import { IRequest } from '../../interface/http/IRequest.interface'

class IsAuthenticatedGuard implements GuardActivator {
  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)
    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      return this.httpAuthentication(req)
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()
      return this.graphQLAuthentication(context)
    }

    return false
  }

  protected readonly httpAuthentication = (req: IRequest) => {
    const { authorization } = req.headers

    if (!authorization) return throwError({ msg: 'missing token', status: 400 })

    const [bearer, token] = authorization.split(' ')

    if (!bearer || !token)
      return throwError({ msg: 'missing bearer token', status: 400 })

    const tokenPayload = verifyToken(token)

    req.tokenPayload = tokenPayload

    return true
  }

  protected readonly graphQLAuthentication = (context: IContext) => {
    const { authorization } = context

    if (!authorization) return throwError({ msg: 'missing token', status: 400 })

    const [bearer, token] = authorization.split(' ')

    if (!bearer || !token)
      return throwError({ msg: 'missing bearer token', status: 400 })

    const tokenPayload = verifyToken(token)

    context.tokenPayload = tokenPayload

    return context
  }
}

export default new IsAuthenticatedGuard()
