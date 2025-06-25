import { NextFunction, Response } from 'express'
import { asyncHandler } from '../common/decorators/async-handler.decorator'
import { IRequest } from '../common/interface/IRequest.interface'
import { CloudUploader } from '../common/services/upload/cloud.service'
import { generateCode } from '../common/utils/randomstring/generate-code.function'

export const uploadAttachments = (folder: string) => {
  return asyncHandler(
    async (req: IRequest, _: Response, next: NextFunction) => {
      if (!req.file || (req.files && !req.files.length)) {
        return next()
      }

      const folderId = req.tokenPayload._id.toString()

      const folderName = `${process.env.APP_NAME}/${folderId}/${folder}`

      if (req.files?.length) {
        req.cloudFiles = { paths: [] }

        for (const file of req.files as Express.Multer.File[]) {
          const paths = await CloudUploader.upload({
            path: file.path,
            folderName,
          })
          req.cloudFiles.folderId = folderId
          req.cloudFiles.paths.push(paths)
        }
      }

      if (req.file) {
        const { secure_url, public_id } = await CloudUploader.upload({
          path: req.file.path,
          folderName,
        })

        req.cloudFile.folderId = folderId
        req.cloudFile.path = { secure_url, public_id }
      }

      return next()
    },
  )
}
