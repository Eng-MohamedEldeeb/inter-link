import { GuardActivator } from '../class/guard-activator.class'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'

import { IRequest } from '../../interface/IRequest.interface'
import { IContext } from '../../interface/IGraphQL.interface'
import { ISocket } from '../../interface/ISocket.interface'

import { verifyToken } from '../../utils/security/token/token.service'
import { throwError } from '../../handlers/error-message.handler'

import {
  GraphQLParams,
  HttpParams,
  SocketServerParams,
} from '../../decorators/context/types'

class IsAuthenticatedGuard implements GuardActivator {
  protected contextArg!: IRequest | IContext | ISocket
  async canActivate(
    ...params: HttpParams | GraphQLParams | SocketServerParams
  ) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()
      this.httpAuthentication(req)
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()
      this.graphQLAuthentication(context)
    }

    if (Ctx.type === ContextType.socketContext) {
      const { socket } = Ctx.switchToSocket()
      this.socketAuthentication(socket)
    }

    return true
  }

  protected readonly httpAuthentication = (req: IRequest) => {
    const { authorization } = req.headers

    if (!authorization) return throwError({ msg: 'missing token', status: 400 })

    const [bearer, token] = authorization.split(' ')

    if (!bearer || !token)
      return throwError({ msg: 'missing bearer token', status: 400 })

    req.tokenPayload = verifyToken(token)
  }

  protected readonly graphQLAuthentication = (context: IContext) => {
    const { authorization } = context

    if (!authorization) return throwError({ msg: 'missing token', status: 400 })

    const [bearer, token] = authorization.split(' ')

    if (!bearer || !token)
      return throwError({ msg: 'missing bearer token', status: 400 })

    context.tokenPayload = verifyToken(token)
  }

  protected readonly socketAuthentication = (socket: ISocket) => {
    const { authorization } = socket.handshake.headers

    if (!authorization) return throwError({ msg: 'missing token', status: 400 })

    const [bearer, token] = authorization.split(' ')

    if (!bearer || !token)
      return throwError({ msg: 'missing bearer token', status: 400 })

    socket.tokenPayload = verifyToken(token)
  }
}

export default new IsAuthenticatedGuard()
