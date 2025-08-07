import { Response } from 'express'
import { successResponse } from '../../../common/handlers/success-response.handler'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { ChatGroupService } from '../chat-group.service'

import {
  IDeleteChat,
  ILikeMessage,
  IDeleteMessage,
  IGetSingleChat,
  IEditMessage,
} from '../dto/chat-group.dto'

export class ChatController {
  protected static readonly ChatGroupService = ChatGroupService

  public static readonly getAllChats = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      return successResponse(res, {
        data: await this.ChatGroupService.getAllChats(profileId),
      })
    },
  )

  public static readonly getSingleChat = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { participant, messages } = await this.ChatGroupService.getSingle(
        req.chat,
      )

      return successResponse(res, {
        data: {
          participant,
          messages,
        },
      })
    },
  )

  public static readonly likeMessage = asyncHandler(
    async (
      req: IRequest<null, Pick<ILikeMessage, 'messageId'>>,
      res: Response,
    ) => {
      const chat = req.chat
      const { _id, username, avatar, fullName } = req.profile
      const { messageId } = req.query

      await this.ChatGroupService.likeMessage({
        profile: { _id, username, avatar, fullName },
        chat,
        messageId,
      })

      return successResponse(res, {
        msg: 'Liked the Message Successfully',
      })
    },
  )

  public static readonly editMessage = asyncHandler(
    async (
      req: IRequest<IGetSingleChat, Pick<IDeleteMessage, 'messageId'>>,
      res: Response,
    ) => {
      const { _id: chatId } = req.chat
      const { _id: profileId } = req.profile
      const { messageId } = req.query
      const { newMessage }: IEditMessage = req.body

      await this.ChatGroupService.editMessage({
        chatId,
        profileId,
        messageId,
        newMessage,
      })

      return successResponse(res, {
        msg: 'Message Has Been Modified Successfully',
      })
    },
  )

  public static readonly deleteMessage = asyncHandler(
    async (
      req: IRequest<IGetSingleChat, Pick<IDeleteMessage, 'messageId'>>,
      res: Response,
    ) => {
      const { _id: chatId } = req.chat
      const { _id: profileId } = req.profile
      const { messageId } = req.query

      await this.ChatGroupService.deleteMessage({
        chatId,
        profileId,
        messageId,
      })

      return successResponse(res, {
        msg: 'Message Has Been Deleted Successfully',
      })
    },
  )

  public static readonly deleteChat = asyncHandler(
    async (req: IRequest<IDeleteChat>, res: Response) => {
      const { _id: profileId } = req.profile
      const chat = req.chat

      await this.ChatGroupService.deleteChat({
        profileId,
        chat,
      })

      return successResponse(res, {
        msg: 'Chat Has Been Deleted Successfully',
      })
    },
  )
}
