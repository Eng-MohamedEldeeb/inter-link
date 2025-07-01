import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { ContextType } from './enums/async-handler.types'
import { CloudUploader } from '../services/upload/cloud.service'
import { ContextDetector } from './context/context-detector.decorator'
import { throwGraphError } from '../handlers/graphql/error.handler'

export const asyncHandler = (fn: Function) => {
  return async (...params: any[any]) => {
    const ctx = ContextDetector.detect(params)
    try {
      if (ctx.type === ContextType.httpContext) {
        const { req, res, next } = ctx.switchToHTTP()

        return await fn(req, res, next)
      }

      if (ctx.type === ContextType.graphContext) {
        const { source, args, context, info } = ctx.switchToGraphQL()
        return await fn(source, args, context, info)
      }
    } catch (error) {
      const { req, next } = ctx.switchToHTTP()

      if (ctx.type === ContextType.httpContext) {
        if (req.cloudFile) {
          await CloudUploader.delete(req.cloudFile.path.public_id)
          await CloudUploader.deleteFolder(
            `${process.env.APP_NAME}/${req.cloudFile.folderId}`,
          )
        }

        if (req.cloudFiles && req.cloudFiles.paths.length) {
          for (const file of req.cloudFiles.paths) {
            await CloudUploader.delete(file.public_id)
          }
          await CloudUploader.deleteFolder(
            `${process.env.APP_NAME}/${req.cloudFiles.folderId}`,
          )
        }
      }

      if (error instanceof TokenExpiredError)
        return ctx.type === ContextType.httpContext
          ? next({ msg: 'Token is expired', status: 400 })
          : throwGraphError(error.message)

      if (error instanceof JsonWebTokenError)
        return ctx.type === ContextType.httpContext
          ? next({ msg: 'in-valid token', status: 400 })
          : throwGraphError(error.message)

      if (error instanceof Error)
        return ctx.type === ContextType.httpContext
          ? next(error)
          : throwGraphError(error.message)

      return next(error)
    }
  }
}
