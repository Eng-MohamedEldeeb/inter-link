import { verifyToken } from '../../../common/utils/security/token/token.service'
import { throwHttpError } from '../../../common/utils/handlers/error-message.handler'
import { GuardActivator } from './can-activate.guard'
import { IContext } from '../interface/IGraphQL.types'

class IsAuthenticatedGuard implements GuardActivator {
  async canActivate(args: any, context: IContext) {
    const { authorization } = context

    if (!authorization) throw new Error('missing token')

    const [bearer, token] = authorization.split(' ')

    if (!bearer || !token) throw new Error('missing bearer token')

    const tokenPayload = verifyToken(token)

    context.tokenPayload = tokenPayload

    return context
  }
}

export default new IsAuthenticatedGuard()
