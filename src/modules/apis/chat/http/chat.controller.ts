import { Response } from "express"
import { successResponse } from "../../../../common/handlers/success-response.handler"
import { IRequest } from "../../../../common/interface/IRequest.interface"
import { asyncHandler } from "../../../../common/decorators/async-handler/async-handler.decorator"

import {
  IDeleteChat,
  ILikeMessage,
  IDeleteMessage,
  IGetSingleChat,
  IEditMessage,
} from "../dto/chat.dto"

import chatService from "../chat.service"
class ChatController {
  private readonly chatService = chatService

  public readonly getAllChats = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      return successResponse(res, {
        // data: await this.chatService.getAllChats(profileId),
      })
    },
  )

  public readonly getSingleChat = asyncHandler(
    async (req: IRequest, res: Response) => {
      // const { participants, messages } = await this.chatService.getSingle(
      //   req.chat,
      // )

      return successResponse(res, {
        // data: {
        //   participants,
        //   messages,
        // },
      })
    },
  )

  public readonly sendImage = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id, username, avatar } = req.profile

      await this.chatService.sendImage({
        profileId: _id,
        user: req.user,
        image: req.cloudFile,
      })

      return successResponse(res, {
        msg: `Image sent to ${req.user.username}`,
      })
    },
  )

  public readonly likeMessage = asyncHandler(
    async (
      req: IRequest<null, Pick<ILikeMessage, "messageId">>,
      res: Response,
    ) => {
      const chat = req.chat
      const { _id, username, avatar } = req.profile
      const { messageId } = req.query

      await this.chatService.likeMessage({
        profileId: _id,
        chat,
        messageId,
      })

      return successResponse(res, {
        msg: "Liked the Message Successfully",
      })
    },
  )

  public readonly editMessage = asyncHandler(
    async (
      req: IRequest<IGetSingleChat, Pick<IDeleteMessage, "messageId">>,
      res: Response,
    ) => {
      const { _id: chatId } = req.chat
      const { _id: profileId } = req.profile
      const { messageId } = req.query
      const { newMessage }: IEditMessage = req.body

      await this.chatService.editMessage({
        chatId,
        profileId,
        messageId,
        newMessage,
      })

      return successResponse(res, {
        msg: "Message Has Been Modified Successfully",
      })
    },
  )

  public readonly deleteMessage = asyncHandler(
    async (
      req: IRequest<IGetSingleChat, Pick<IDeleteMessage, "messageId">>,
      res: Response,
    ) => {
      const { _id: chatId } = req.chat
      const { _id: profileId } = req.profile
      const { messageId } = req.query

      await this.chatService.deleteMessage({
        chatId,
        profileId,
        messageId,
      })

      return successResponse(res, {
        msg: "Message Has Been Deleted Successfully",
      })
    },
  )

  public readonly deleteChat = asyncHandler(
    async (req: IRequest<IDeleteChat>, res: Response) => {
      const { _id: profileId } = req.profile
      const chat = req.chat

      await this.chatService.deleteChat({
        profileId,
        chat,
      })

      return successResponse(res, {
        msg: "Chat Has Been Deleted Successfully",
      })
    },
  )
}

export default new ChatController()
