import { NextFunction } from 'express'
import { IRequest } from '../../interface/IRequest.interface'
import { asyncHandler } from '../../decorators/async-handler/async-handler.decorator'
import { fileUploader } from '../../decorators/upload/file-uploader.decorator'
import slugify from 'slugify'
import { ICreateGroup } from '../../../modules/group/dto/group.dto'

export const groupCoverUploader = asyncHandler(
  async (req: IRequest, _: Response, next: NextFunction) => {
    const { name }: ICreateGroup = req.body
    const folderId = slugify(name).toLowerCase()
    const folder = `groups/${folderId}`

    await fileUploader({ folder, folderId, req })

    return next()
  },
)
