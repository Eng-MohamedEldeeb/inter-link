import { Response } from 'express'
import { successResponse } from '../../../common/handlers/success-response.handler'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { ChatService } from '../chat.service'
import {
  IStartChat,
  IDeleteChat,
  ILikeMessage,
  IDeleteMessage,
} from '../dto/chat.dto'

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

      return successResponse(res, {
        data: chat,
      })
    },
  )

  public static readonly startChat = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const { _id: userId, username } = req.user
      const { message }: Pick<IStartChat, 'message'> = req.body

      await this.ChatService.startChat({ profileId, userId, message })

      return successResponse(res, {
        msg: `Message was sent to ${username} successfully`,
      })
    },
  )

  public static readonly likeMessage = asyncHandler(
    async (
      req: IRequest<null, Pick<ILikeMessage, 'messageId'>>,
      res: Response,
    ) => {
      const { _id: chatId } = req.chat
      const { messageId } = req.query

      await this.ChatService.likeMessage({
        chatId,
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
      const { _id: chatId } = req.chat
      const { messageId } = req.query

      await this.ChatService.deleteMessage({
        chatId,
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
      const { _id: chatId } = req.chat

      await this.ChatService.deleteChat({
        chatId,
        profileId,
      })

      return successResponse(res, {
        msg: 'Chat is Deleted successfully',
      })
    },
  )
}
