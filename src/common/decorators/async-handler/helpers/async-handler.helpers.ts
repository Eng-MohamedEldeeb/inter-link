import { IRequest } from '../../../interface/IRequest.interface'
import { CloudUploader } from '../../../services/upload/cloud.service'
import { ContextDetector } from '../../context/context-detector.decorator'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { ContextType } from '../../context/types/enum/context-type.enum'
import { IError } from '../../../handlers/http/global-error.handler'
import { GraphQLError } from 'graphql'

export const deleteFilesAfterError = async (req: IRequest) => {
  if (req.cloudFile?.folderId) {
    await CloudUploader.delete(req.cloudFile.path.public_id)
    await CloudUploader.deleteFolder(req.cloudFile.fullPath)
  }

  if (req.cloudFiles?.paths.length) {
    for (const file of req.cloudFiles.paths) {
      await CloudUploader.delete(file.public_id)
    }
    await CloudUploader.deleteFolder(req.cloudFiles.fullPath)
  }
}

export const throwErrorByInstanceType = (
  error: unknown,
  ctx: typeof ContextDetector,
) => {
  const { next } = ctx.switchToHTTP()
  switch (true) {
    case error instanceof TokenExpiredError:
      if (ctx.type === ContextType.httpContext)
        return next({ msg: 'Token is expired', status: 400 })
      throw new GraphQLError('Token Error', {
        extensions: { msg: 'Token is expired', status: 400 },
      })

    case error instanceof JsonWebTokenError:
      if (ctx.type === ContextType.httpContext)
        return next({ msg: 'in-valid token', status: 400 })
      throw new GraphQLError('Token Error', {
        extensions: { msg: 'in-valid token', status: 400 },
      })

    case error instanceof JsonWebTokenError:
      if (ctx.type === ContextType.httpContext) return next(error)
      throw new GraphQLError('Token Error', {
        extensions: { msg: error.message, status: 400 },
      })

    default:
      if (ctx.type === ContextType.httpContext) return next(error)

      const { extensions, msg, details, message }: GraphQLError & IError =
        error as any
      throw new GraphQLError(msg || message, {
        extensions: { ...extensions, details },
      })
  }
}
