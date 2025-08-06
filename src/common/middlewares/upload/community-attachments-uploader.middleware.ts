import { NextFunction } from 'express'
import { IRequest } from '../../interface/IRequest.interface'
import { asyncHandler } from '../../decorators/async-handler/async-handler.decorator'
import { fileUploader } from '../../decorators/upload/file-uploader.decorator'
import { generateCode } from '../../utils/randomstring/generate-code.function'

export const communityAttachmentsUploader = asyncHandler(
  async (req: IRequest, _: Response, next: NextFunction) => {
    const { cover } = req.community
    const folderId = `post_${generateCode({ length: 8, charset: 'alphanumeric' })}`
    const folder = `communities/${cover.folderId}/posts/${folderId}`

    await fileUploader({ folder, folderId, req })

    return next()
  },
)
