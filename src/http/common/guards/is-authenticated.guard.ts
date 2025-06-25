import { verifyToken } from '../../../common/utils/security/token/token.service'
import { throwHttpError } from '../utils/handlers/error-message.handler'
import { IRequest } from '../interface/IRequest.interface'
import { GuardActivator } from './can-activate.guard'

class IsAuthenticatedGuard implements GuardActivator {
  canActivate(req: IRequest) {
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
}

export default new IsAuthenticatedGuard()
