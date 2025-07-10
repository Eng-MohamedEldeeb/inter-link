import { IRequest } from '../../interface/http/IRequest.interface'
import { CloudUploader } from '../../services/upload/cloud.service'

export const fileUploader = async ({
  folder,
  folderId,
  req,
}: {
  folder: string
  folderId: string
  req: IRequest
}) => {
  const fullPath = `${process.env.APP_NAME}/${req.tokenPayload._id.toString()}/${folder}`

  req.cloudFile = {
    folderId: '',
    fullPath: '',
    path: { secure_url: '', public_id: '' },
  }

  req.cloudFiles = { folderId: '', fullPath: '', paths: [] }

  if (req.files && req.files.length) {
    for (const file of req.files as Express.Multer.File[]) {
      const paths = await CloudUploader.upload({
        path: file.path,
        folderName: fullPath,
      })
      req.cloudFiles.fullPath = fullPath
      req.cloudFiles.folderId = folderId
      req.cloudFiles.paths.push(paths)
    }
  }

  if (req.file) {
    const { secure_url, public_id } = await CloudUploader.upload({
      path: req.file.path,
      folderName: fullPath,
    })

    req.cloudFile.path = { secure_url, public_id }
    req.cloudFile.folderId = folderId
    req.cloudFile.fullPath = fullPath
  }
}
