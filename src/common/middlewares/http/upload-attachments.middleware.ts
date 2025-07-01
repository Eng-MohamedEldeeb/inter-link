import { NextFunction, Response } from 'express'
import { IRequest } from '../../interface/http/IRequest.interface'
import { CloudUploader } from '../../services/upload/cloud.service'
import { asyncHandler } from '../../decorators/async-handler.decorator'

export const uploadAttachments = (folder: string) => {
  return asyncHandler(
    async (req: IRequest, _: Response, next: NextFunction) => {
      const folderId = req.tokenPayload._id.toString()

      const folderName = `${process.env.APP_NAME}/${folderId}/${folder}`

      req.cloudFile = {
        folderId: '',
        path: { secure_url: '', public_id: '' },
      }

      req.cloudFiles = { folderId: '', paths: [] }

      if (req.files && req.files.length) {
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

        req.cloudFile.path = { secure_url, public_id }
        req.cloudFile.folderId = folderId
      }

      return next()
    },
  )
}
