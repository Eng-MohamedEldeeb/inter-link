import { Response } from 'express'
import { successResponse } from '../../../common/handlers/success-response.handler'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { GroupService } from '../group.service'

import {
  IDeleteChat,
  ILikeMessage,
  IDeleteMessage,
  IGetSingle,
  IEditMessage,
  ICreateGroup,
} from '../dto/chat-group.dto'

export class GroupController {
  protected static readonly GroupService = GroupService

  public static readonly getAllGroups = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      return successResponse(res, {
        data: await this.GroupService.getAllChats(profileId),
      })
    },
  )

  public static readonly getSingle = asyncHandler(
    async (req: IRequest, res: Response) => {
      return successResponse(res, {
        data: await this.GroupService.getSingle(req.group),
      })
    },
  )

  public static readonly create = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const createGroupDto: Omit<ICreateGroup, 'createdBy'> = req.body

      await this.GroupService.create({
        ...createGroupDto,
        createdBy: profileId,
      })

      return successResponse(res, {
        msg: 'done',
      })
    },
  )

  public static readonly likeMessage = asyncHandler(
    async (
      req: IRequest<null, Pick<ILikeMessage, 'messageId'>>,
      res: Response,
    ) => {
      const group = req.group

      const { _id, username, avatar, fullName } = req.profile
      const { messageId } = req.query

      await this.GroupService.likeMessage({
        profile: { _id, username, avatar, fullName },
        group,
        messageId,
      })

      return successResponse(res, {
        msg: 'Liked the Message Successfully',
      })
    },
  )

  public static readonly editMessage = asyncHandler(
    async (
      req: IRequest<IGetSingle, Pick<IDeleteMessage, 'messageId'>>,
      res: Response,
    ) => {
      const { _id: chatId } = req.chat
      const { _id: profileId } = req.profile
      const { messageId } = req.query
      const { newMessage }: IEditMessage = req.body

      await this.GroupService.editMessage({
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
      req: IRequest<IGetSingle, Pick<IDeleteMessage, 'messageId'>>,
      res: Response,
    ) => {
      const { _id: chatId } = req.chat
      const { _id: profileId } = req.profile
      const { messageId } = req.query

      await this.GroupService.deleteMessage({
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
      const group = req.chat

      // await this.GroupService.deleteChat({
      //   profileId,
      //   group,
      // })

      return successResponse(res, {
        msg: 'Chat Has Been Deleted Successfully',
      })
    },
  )
}
