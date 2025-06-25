import { verifyToken } from '../../../common/utils/security/token/token.service'
import { GuardActivator } from './can-activate.guard'
import { IContext } from '../interface/IGraphQL.types'
import { throwGraphError } from '../handler/error.handler'

class IsAuthenticatedGuard implements GuardActivator {
  async canActivate(args: any, context: IContext) {
    const { authorization } = context

    if (!authorization) return throwGraphError('missing token')

    const [bearer, token] = authorization.split(' ')

    if (!bearer || !token) return throwGraphError('missing bearer token')

    const tokenPayload = verifyToken(token)

    context.tokenPayload = tokenPayload

    return context
  }
}

export default new IsAuthenticatedGuard()
