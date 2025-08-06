import { NextFunction } from 'express'
import { IRequest } from '../../interface/IRequest.interface'
import { asyncHandler } from '../../decorators/async-handler/async-handler.decorator'
import { fileUploader } from '../../decorators/upload/file-uploader.decorator'
import { ICreateCommunity } from '../../../modules/community/dto/community.dto'

import slugify from 'slugify'

export const communityCoverUploader = asyncHandler(
  async (req: IRequest, _: Response, next: NextFunction) => {
    const { name }: ICreateCommunity = req.body
    const folderId = slugify(name).toLowerCase()
    const folder = `communitys/${folderId}`

    await fileUploader({ folder, folderId, req })

    return next()
  },
)
