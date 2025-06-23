import { NextFunction, Response } from 'express'
import { IRequest } from '../interface/IRequest.interface'
import { CloudUploader } from '../services/upload/cloud.service'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

export const asyncHandler = <P = any, Q = any>(fn: Function) => {
  return async (...args: any[any]): Promise<void> => {
    if ('req' in args) {
      const [req, res, next]: [IRequest<P, Q>, Response, NextFunction] = args
      try {
        return await fn(req as IRequest<P, Q>, res, next)
      } catch (error) {
        const fileRequest = req as IRequest

        if (error instanceof TokenExpiredError)
          return next({ msg: 'Token is expired', status: 400 })

        if (error instanceof JsonWebTokenError)
          return next({ msg: 'in-valid token', status: 400 })

        if (error instanceof Error) return next(error)

        return next(error)
      }
    }
  }
}

// if (fileRequest.cloudFiles && fileRequest.cloudFiles.paths.length) {
//   for (const file of fileRequest.cloudFiles.paths) {
//     await CloudUploader.delete(file.public_id)
//   }
//   await CloudUploader.deleteFolder(
//     `${process.env.APP_NAME}/${fileRequest.cloudFiles.folderId}`,
//   )
// }
