import { NextFunction, Response } from 'express'
import { asyncHandler } from '../common/decorators/async-handler.decorator'
import { IRequest } from '../common/interface/IRequest.interface'
import { CloudUploader } from '../common/services/upload/cloud.service'

export const uploadAttachments = (folderName: string) => {
  return asyncHandler(
    async (req: IRequest, _: Response, next: NextFunction) => {
      if (req.files && !req.files.length) {
        return next()
      }

      const folderId = req.params.id.toString()

      req.cloudFiles = { paths: [] }

      for (const file of req.files as Express.Multer.File[]) {
        const paths = await CloudUploader.upload({
          path: file.path,
          folderName: `${process.env.APP_NAME}/${folderId}/${folderName}`,
        })
        // req.cloudFiles.paths.push(paths)
      }

      return next()
    },
  )
}
