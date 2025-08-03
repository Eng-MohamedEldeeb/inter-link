import { Response } from 'express'
import { successResponse } from '../../../common/handlers/success-response.handler'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { ChatService } from '../chat.service'

import { IDeleteChat, ILikeMessage, IDeleteMessage } from '../dto/chat.dto'

export class ChatController {
  protected static readonly ChatService = ChatService

  public static readonly getAllChats = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      return successResponse(res, {
        data: await this.ChatService.getAllChats(profileId),
      })
    },
  )

  public static readonly getSingleChat = asyncHandler(
    async (req: IRequest, res: Response) => {
      const chat = req.chat
      await this.ChatService.emptyMissedMessages(chat)
      return successResponse(res, {
        data: {
          messaging: chat.messaging,
          messages: chat.messages,
        },
      })
    },
  )

  public static readonly likeMessage = asyncHandler(
    async (
      req: IRequest<null, Pick<ILikeMessage, 'messageId'>>,
      res: Response,
    ) => {
      const { _id: currentChatId } = req.chat
      const { messageId } = req.query

      await this.ChatService.likeMessage({
        currentChatId,
        messageId,
      })

      return successResponse(res, {
        msg: 'Liked the Message successfully',
      })
    },
  )

  public static readonly deleteMessage = asyncHandler(
    async (
      req: IRequest<null, Pick<IDeleteMessage, 'messageId'>>,
      res: Response,
    ) => {
      const { _id: currentChatId } = req.chat
      const { messageId } = req.query

      await this.ChatService.deleteMessage({
        currentChatId,
        messageId,
      })

      return successResponse(res, {
        msg: 'Message is Deleted successfully',
      })
    },
  )

  public static readonly deleteChat = asyncHandler(
    async (req: IRequest<IDeleteChat>, res: Response) => {
      const { _id: profileId } = req.profile
      const { _id: currentChatId } = req.chat

      await this.ChatService.deleteChat({
        currentChatId,
        profileId,
      })

      return successResponse(res, {
        msg: 'Chat is Deleted successfully',
      })
    },
  )
}
