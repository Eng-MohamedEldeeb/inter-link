import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'

import { IRequest } from '../../interface/IRequest.interface'
import { IContext } from '../../interface/IGraphQL.interface'
import { ISocket } from '../../interface/ISocket.interface'

import { verifyToken } from '../../utils/security/token/token.service'
import { throwError } from '../../handlers/error-message.handler'

import {
  GraphQLParams,
  HttpParams,
  SocketServerParams,
} from '../../decorators/context/types/context-detector.types'

class IsAuthenticatedGuard implements GuardActivator {
  async canActivate(
    ...params: HttpParams | GraphQLParams | SocketServerParams
  ) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()
      return this.httpAuthentication(req)
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()
      return this.graphQLAuthentication(context)
    }

    if (Ctx.type === ContextType.socketContext) {
      const { socket } = Ctx.switchToSocket()
      return this.socketAuthentication(socket)
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

  protected readonly socketAuthentication = (socket: ISocket) => {
    const { authorization } = socket.handshake.headers

    if (!authorization) return throwError({ msg: 'missing token', status: 400 })

    const [bearer, token] = authorization.split(' ')

    if (!bearer || !token)
      return throwError({ msg: 'missing bearer token', status: 400 })

    const tokenPayload = verifyToken(token)

    socket.tokenPayload = tokenPayload

    return true
  }
}

export default new IsAuthenticatedGuard()
