import { NextFunction } from "express"
import { asyncHandler, fileUploader } from "../../decorators"

import { IRequest } from "../../interface/IRequest.interface"
import { generateCode } from "../../utils/randomstring/generate-code.function"

export const commentAttachmentUploader = asyncHandler(
  async (req: IRequest, _: Response, next: NextFunction) => {
    const { folderId: postFolderId } = req.post.attachments

    const folderId = `comment_${generateCode({ length: 8, charset: "alphanumeric" })}`
    const folder = `posts/${postFolderId}/comments/${folderId}`

    await fileUploader({ folder, folderId, req })

    return next()
  },
)
