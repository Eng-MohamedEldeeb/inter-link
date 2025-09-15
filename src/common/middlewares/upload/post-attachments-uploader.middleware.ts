import { NextFunction } from "express"
import { asyncHandler, fileUploader } from "../../decorators"

import { IRequest } from "../../interface/IRequest.interface"
import { RandomString } from "../../utils/randomstring/generate-code.function"

export const postAttachmentUploader = asyncHandler(
  async (req: IRequest, _: Response, next: NextFunction) => {
    const folderId = `post_${RandomString.generateCode({ length: 8, charset: "alphanumeric" })}`
    const folder = `posts/${folderId}`

    await fileUploader({ folder, folderId, req })

    return next()
  },
)
