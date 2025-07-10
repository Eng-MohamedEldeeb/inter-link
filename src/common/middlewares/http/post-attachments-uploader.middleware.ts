import { NextFunction } from 'express'
import { IRequest } from '../../interface/http/IRequest.interface'
import { asyncHandler } from '../../decorators/async-handler/async-handler.decorator'
import { generateCode } from '../../utils/randomstring/generate-code.function'
import { fileUploader } from '../../decorators/upload/file-uploader.decorator'

export const postAttachmentUploader = asyncHandler(
  async (req: IRequest, _: Response, next: NextFunction) => {
    const folderId = `post_${generateCode({ length: 8, charset: 'alphanumeric' })}`
    const folder = `posts/${folderId}`

    await fileUploader({ folder, folderId, req })

    return next()
  },
)
