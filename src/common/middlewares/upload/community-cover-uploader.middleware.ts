import slugify from "slugify"

import { NextFunction } from "express"
import { asyncHandler, fileUploader } from "../../decorators"

import { IRequest } from "../../interface/IRequest.interface"
import { ICreateCommunity } from "../../../modules/apis/community/dto/community.dto"

export const communityCoverUploader = asyncHandler(
  async (req: IRequest, _: Response, next: NextFunction) => {
    const { name }: ICreateCommunity = req.body
    const folderId = slugify(name).toLowerCase()
    const folder = `communities/${folderId}`

    await fileUploader({ folder, folderId, req })

    return next()
  },
)
