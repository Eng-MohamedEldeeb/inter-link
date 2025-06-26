import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { ContextType } from './types/async-handler.types'
import { CloudUploader } from '../services/upload/cloud.service'
import { ContextDetector } from './context/context-detector.decorator'
import { throwGraphError } from '../handlers/graphql/error.handler'
import { IRequest } from '../interface/http/IRequest.interface'

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
        const fileRequest = req as IRequest

        if (fileRequest.cloudFiles && fileRequest.cloudFiles.paths.length) {
          for (const file of fileRequest.cloudFiles.paths) {
            await CloudUploader.delete(file.public_id)
          }
          await CloudUploader.deleteFolder(
            `${process.env.APP_NAME}/${fileRequest.cloudFiles.folderId}`,
          )
        }
      }

      if (error instanceof TokenExpiredError)
        return contextType === ContextType.httpContext
          ? next({ msg: 'Token is expired', status: 400 })
          : contextType === ContextType.graphContext
            ? throwGraphError(error.message)
            : console.log({ error })

      if (error instanceof JsonWebTokenError)
        return contextType === ContextType.httpContext
          ? next({ msg: 'in-valid token', status: 400 })
          : contextType === ContextType.graphContext
            ? throwGraphError(error.message)
            : console.log({ error })

      if (error instanceof Error)
        return contextType === ContextType.httpContext
          ? next(error)
          : contextType === ContextType.graphContext
            ? throwGraphError(error.message)
            : console.log({ error })

      return contextType === ContextType.httpContext
        ? next(error)
        : console.log({ error })
    }
  }
}
