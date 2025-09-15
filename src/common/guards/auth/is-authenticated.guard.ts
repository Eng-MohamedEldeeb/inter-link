import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"

import { IRequest } from "../../interface/IRequest.interface"
import { IContext } from "../../interface/IGraphQL.interface"
import { ISocket } from "../../interface/ISocket.interface"

import { verifyToken } from "../../utils/security/token/token.service"
import { throwError } from "../../handlers/error-message.handler"

import {
  GraphQLParams,
  HttpParams,
  SocketServerParams,
} from "../../decorators/context/types"

class IsAuthenticatedGuard implements GuardActivator {
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

  private readonly httpAuthentication = (req: IRequest) => {
    const { authorization } = req.headers

    if (!authorization)
      return throwError({ msg: "Token is required", status: 499 })

    const [bearer, token] = authorization.split(" ")

    if (!bearer || !token)
      return throwError({
        msg: "Invalid Token, missing bearer key",
        status: 498,
      })

    req.tokenPayload = verifyToken(token)
  }

  private readonly graphQLAuthentication = (context: IContext) => {
    const { authorization } = context

    if (!authorization) return throwError({ msg: "Token is required" })

    const [bearer, token] = authorization.split(" ")

    if (!bearer || !token)
      return throwError({ msg: "Invalid Token, missing bearer key" })

    context.tokenPayload = verifyToken(token)
  }

  private readonly socketAuthentication = (socket: ISocket) => {
    const { authorization } = socket.handshake.headers

    if (!authorization) return throwError({ msg: "Token is required" })

    const [bearer, token] = authorization.split(" ")

    if (!bearer || !token)
      return throwError({ msg: "Invalid Token, missing bearer key" })

    socket.tokenPayload = verifyToken(token)
  }
}

export default new IsAuthenticatedGuard()
