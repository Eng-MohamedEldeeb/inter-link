import { NextFunction } from 'express'
import { IRequest } from '../../interface/IRequest.interface'
import { asyncHandler } from '../../decorators/async-handler/async-handler.decorator'
import { generateCode } from '../../utils/randomstring/generate-code.function'
import { fileUploader } from '../../decorators/upload/file-uploader.decorator'

export const storyAttachmentUploader = asyncHandler(
  async (req: IRequest, _: Response, next: NextFunction) => {
    const folderId = `story_${generateCode({ length: 8, charset: 'alphanumeric' })}`
    const folder = `stories/${folderId}`

    await fileUploader({ folder, folderId, req })

    return next()
  },
)
