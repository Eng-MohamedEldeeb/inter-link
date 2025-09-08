import { Response } from "express"
import { successResponse } from "../../../common/handlers/success-response.handler"
import { IRequest } from "../../../common/interface/IRequest.interface"
import { asyncHandler } from "../../../common/decorators/async-handler/async-handler.decorator"

import {
  IDeleteGroup,
  ILikeMessage,
  IDeleteMessage,
  IGetSingleGroup,
  IEditMessage,
  ICreateGroup,
  IUpdateGroup,
} from "../dto/group.dto"

import groupService from "../group.service"
class GroupController {
  private readonly groupService = groupService

  public readonly getAllGroups = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      return successResponse(res, {
        data: await this.groupService.getAllGroups(profileId),
      })
    },
  )

  public readonly getSingle = asyncHandler(
    async (req: IRequest, res: Response) => {
      return successResponse(res, {
        data: await this.groupService.getSingle(req.group),
      })
    },
  )

  public readonly create = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const cover = req.cloudFile
      const createGroupDto: Omit<ICreateGroup, "createdBy"> = req.body

      await this.groupService.create({
        ...createGroupDto,
        createdBy: profileId,
        cover,
      })

      return successResponse(res, {
        msg: `Group has been Created Successfully`,
      })
    },
  )

  public readonly likeMessage = asyncHandler(
    async (
      req: IRequest<null, Pick<ILikeMessage, "messageId">>,
      res: Response,
    ) => {
      const { _id, username, avatar } = req.profile
      const { messageId } = req.query

      const group = req.group

      await this.groupService.likeMessage({
        profile: { _id, username, avatar },
        group,
        messageId,
      })

      return successResponse(res, {
        msg: "Liked the Message Successfully",
      })
    },
  )

  public readonly editMessage = asyncHandler(
    async (
      req: IRequest<IGetSingleGroup, Pick<IDeleteMessage, "messageId">>,
      res: Response,
    ) => {
      const { _id: groupId } = req.group
      const { _id: profileId } = req.profile
      const { messageId } = req.query
      const { newMessage }: IEditMessage = req.body

      await this.groupService.editMessage({
        groupId,
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
      req: IRequest<IGetSingleGroup, Pick<IDeleteMessage, "messageId">>,
      res: Response,
    ) => {
      const { _id: groupId } = req.group
      const { _id: profileId } = req.profile
      const { messageId } = req.query

      await this.groupService.deleteMessage({
        groupId,
        profileId,
        messageId,
      })

      return successResponse(res, {
        msg: "Message Has Been Deleted Successfully",
      })
    },
  )

  public readonly deleteGroup = asyncHandler(
    async (req: IRequest<IDeleteGroup>, res: Response) => {
      const { _id: profileId } = req.profile
      const group = req.chat

      // await this.groupService.deleteChat({
      //   profileId,
      //   group,
      // })

      return successResponse(res, {
        msg: "Group Has Been Deleted Successfully",
      })
    },
  )

  public readonly editGroup = asyncHandler(
    async (req: IRequest<null, Pick<IUpdateGroup, "id">>, res: Response) => {
      const { _id: id } = req.group
      const { _id: createdBy } = req.profile
      const updateGroupDTO: IUpdateGroup = req.body
      await this.groupService.editGroup({ ...updateGroupDTO, id, createdBy })

      return successResponse(res, {
        msg: "Group Has Been Deleted Successfully",
      })
    },
  )
}

export default new GroupController()
