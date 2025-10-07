import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"

import { GraphQLError } from "graphql"
import { IRequest } from "../../../interface/IRequest.interface"
import { CloudUploader } from "../../../services/upload/cloud.service"
import { ContextDetector } from "../../context/context-detector.decorator"
import { ContextType } from "../../context/types"
import { IError } from "../../../handlers/global-error.handler"

const deleteFiles = async (req: IRequest) => {
  if (req.cloudFile?.folderId) {
    await CloudUploader.deleteFolder({ fullPath: req.cloudFile.fullPath })
  }

  if (req.cloudFiles?.paths.length) {
    await CloudUploader.deleteFolder({ fullPath: req.cloudFiles.fullPath })
  }
}

export const onError = async (error: any, ctx: typeof ContextDetector) => {
  const { req, next } = ctx.switchToHTTP()
  const { socketServerNext } = ctx.switchToSocket()

  console.log({ error })

  if (ctx.type === ContextType.httpContext) await deleteFiles(req)

  switch (true) {
    case error instanceof TokenExpiredError:
      if (ctx.type === ContextType.httpContext)
        return next({ msg: "Token is expired", status: 400 })

      if (ctx.type === ContextType.graphContext)
        throw new GraphQLError("Token Error", {
          extensions: { msg: "Token is expired", status: 400 },
        })

      if (ctx.type === ContextType.socketContext)
        return socketServerNext(new Error("Token is expired"))

    case error instanceof JsonWebTokenError:
      if (ctx.type === ContextType.httpContext)
        return next({ msg: "Invalid token", status: 400 })

      if (ctx.type === ContextType.graphContext)
        throw new GraphQLError("Token Error", {
          extensions: { msg: "Invalid token", status: 400 },
        })

      if (ctx.type === ContextType.socketContext)
        if (ctx.hasSocketMiddlewareParams())
          return socketServerNext(new Error("Invalid token"))

    case error instanceof JsonWebTokenError:
      if (ctx.type === ContextType.httpContext) return next(error)

      if (ctx.type === ContextType.graphContext)
        throw new GraphQLError("Token Error", {
          extensions: { msg: error.message, status: 400 },
        })

      if (ctx.type === ContextType.socketContext)
        if (ctx.hasSocketMiddlewareParams())
          return socketServerNext(new Error("Token Error"))

    default:
      if (ctx.type === ContextType.httpContext) return next(error)

      if (ctx.type === ContextType.graphContext) {
        const { msg, message, extensions, details }: GraphQLError & IError =
          error

        throw new GraphQLError(msg || message, {
          extensions: { ...(extensions && extensions), details },
        })
      }

      if (ctx.type === ContextType.socketContext) {
        return socketServerNext
          ? socketServerNext(new Error(error.msg || error.message))
          : console.log({ error })
      }
  }
}
