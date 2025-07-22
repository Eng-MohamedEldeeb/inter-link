import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

import { IRequest } from '../../../interface/IRequest.interface'
import { CloudUploader } from '../../../services/upload/cloud.service'
import { ContextDetector } from '../../context/context-detector.decorator'
import { ContextType } from '../../context/types/enum/context-type.enum'
import { IError } from '../../../handlers/http/global-error.handler'
import { GraphQLError } from 'graphql'

export const deleteFilesAfterError = async (req: IRequest) => {
  if (req.cloudFile?.folderId) {
    await CloudUploader.deleteFolder({ fullPath: req.cloudFile.fullPath })
  }

  if (req.cloudFiles?.paths.length) {
    await CloudUploader.deleteFolder({ fullPath: req.cloudFiles.fullPath })
  }
}

export const throwErrorByInstanceType = (
  error: any,
  ctx: typeof ContextDetector,
) => {
  const { next } = ctx.switchToHTTP()
  const { socketServerNext } = ctx.switchToSocket()

  switch (true) {
    case error instanceof TokenExpiredError:
      if (ctx.type === ContextType.httpContext)
        return next({ msg: 'Token is expired', status: 400 })

      if (ctx.type === ContextType.graphContext)
        throw new GraphQLError('Token Error', {
          extensions: { msg: 'Token is expired', status: 400 },
        })

      if (ctx.type === ContextType.socketContext)
        if (ctx.hasSocketMiddlewareParams())
          return socketServerNext(new Error('Token is expired'))

    case error instanceof JsonWebTokenError:
      if (ctx.type === ContextType.httpContext)
        return next({ msg: 'in-valid token', status: 400 })

      if (ctx.type === ContextType.graphContext)
        throw new GraphQLError('Token Error', {
          extensions: { msg: 'in-valid token', status: 400 },
        })

      if (ctx.type === ContextType.socketContext)
        if (ctx.hasSocketMiddlewareParams())
          return socketServerNext(new Error('in-valid token'))

    case error instanceof JsonWebTokenError:
      if (ctx.type === ContextType.httpContext) return next(error)

      if (ctx.type === ContextType.graphContext)
        throw new GraphQLError('Token Error', {
          extensions: { msg: error.message, status: 400 },
        })

      if (ctx.type === ContextType.socketContext)
        if (ctx.hasSocketMiddlewareParams())
          return socketServerNext(new Error('Token Error'))

    default:
      if (ctx.type === ContextType.httpContext) return next(error)

      if (ctx.type === ContextType.graphContext) {
        const { extensions, msg, details, message }: GraphQLError & IError =
          error as any

        throw new GraphQLError(msg || message, {
          extensions: { ...(extensions && extensions), details },
        })
      }
  }
}
