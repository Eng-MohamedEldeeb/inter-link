import { NextFunction } from "express"
import { asyncHandler, fileUploader } from "../../decorators"

import { IRequest } from "../../interface/IRequest.interface"
import { RandomString } from "../../utils/randomstring/generate-code.function"

export const storyAttachmentUploader = asyncHandler(
  async (req: IRequest, _: Response, next: NextFunction) => {
    const folderId = `story_${RandomString.generateCode({ length: 8, charset: "alphanumeric" })}`
    const folder = `stories/${folderId}`

    await fileUploader({ folder, folderId, req })

    return next()
  },
)
