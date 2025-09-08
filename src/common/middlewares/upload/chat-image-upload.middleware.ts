import { NextFunction } from "express"
import { IRequest } from "../../interface/IRequest.interface"
import { asyncHandler, fileUploader } from "../../decorators"

export const chatImageUploader = asyncHandler(
  async (req: IRequest, _: Response, next: NextFunction) => {
    const folderId = `chat_${req.chat._id.toString()}`
    const folder = `chats/${folderId}`

    await fileUploader({ folder, folderId, req })

    return next()
  },
)
