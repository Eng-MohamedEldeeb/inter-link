import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { ContextType } from './types/async-handler.types'
import { CloudUploader } from '../services/upload/cloud.service'
import { ContextDetector } from './context/context-detector.decorator'
import { throwGraphError } from '../handlers/graphql/error.handler'

export const asyncHandler = (fn: Function) => {
  return async (...params: any[any]) => {
    const contextType = ContextDetector.detect(params)
    try {
      if (contextType === ContextType.httpContext) {
        const { req, res, next } = ContextDetector.switchToHTTP(params)
        return await fn(req, res, next)
      }

      if (contextType === ContextType.graphContext) {
        const { source, args, context, info } =
          ContextDetector.switchToGraphQL(params)
        return await fn(source, args, context, info)
      }
    } catch (error) {
      const { req, next } = ContextDetector.switchToHTTP(params)

      if (contextType === ContextType.httpContext) {
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
        return contextType === ContextType.httpContext
          ? next({ msg: 'Token is expired', status: 400 })
          : throwGraphError(error.message)

      if (error instanceof JsonWebTokenError)
        return contextType === ContextType.httpContext
          ? next({ msg: 'in-valid token', status: 400 })
          : throwGraphError(error.message)

      if (error instanceof Error)
        return contextType === ContextType.httpContext
          ? next(error)
          : throwGraphError(error.message)

      return next(error)
    }
  }
}
