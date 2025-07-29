import { Response } from 'express'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { successResponse } from '../../../common/handlers/success-response.handler'
import { GroupService } from '../group.service'
import { PostService } from '../../post/post.service'
import { ICreatePost } from '../../post/dto/post.dto'

import * as DTO from '../dto/group.dto'

export class GroupController {
  private static readonly GroupService = GroupService
  private static readonly PostService = PostService

  public static readonly getGroup = asyncHandler(
    (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const group = req.group
      return successResponse(res, {
        data: this.GroupService.getGroup({ profileId, group }),
      })
    },
  )

  public static readonly create = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.profile
      const cover = req.cloudFile
      const createGroupDTO: DTO.ICreateGroup = req.body
      return successResponse(res, {
        status: 201,
        msg: 'Group is created Successfully',
        data: await this.GroupService.create({
          createdBy: _id,
          createGroupDTO,
          cover,
        }),
      })
    },
  )

  public static readonly addPost = asyncHandler(
    async (req: IRequest<DTO.IGetGroup>, res: Response) => {
      const { _id } = req.profile
      const { _id: groupId, name } = req.group

      const attachments = req.cloudFiles
      const createPost: ICreatePost = req.body

      return successResponse(res, {
        status: 201,
        msg: `Post is uploaded to ${name} Group Successfully`,
        data: await this.PostService.create({
          createdBy: _id,
          attachments,
          createPost: {
            ...createPost,
            onGroup: groupId,
          },
        }),
      })
    },
  )

  public static readonly removePost = asyncHandler(
    async (req: IRequest<DTO.IGetGroup, DTO.IRemovePost>, res: Response) => {
      const { _id: postId } = req.post
      const { _id: groupId, name } = req.group

      await this.PostService.removeFromGroup({ groupId, postId })

      return successResponse(res, {
        msg: `Post is deleted from ${name} Group Successfully`,
      })
    },
  )

  public static readonly addAdmin = asyncHandler(
    async (req: IRequest<DTO.IGetGroup>, res: Response) => {
      const { _id: userId, username } = req.user
      const { group } = req

      await this.GroupService.addAdmin({
        group,
        userId,
      })

      return successResponse(res, {
        msg: `User '${username}' is now a Group Admin`,
      })
    },
  )

  public static readonly removeAdmin = asyncHandler(
    async (req: IRequest<DTO.IGetGroup>, res: Response) => {
      const { _id: userId, username } = req.user
      const { group } = req

      await this.GroupService.removeAdmin({
        group,
        userId,
      })

      return successResponse(res, {
        msg: `User '${username}' is not a Group Admin anymore`,
      })
    },
  )

  public static readonly edit = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: groupId } = req.group
      const editGroup: DTO.IEditGroup = req.body

      return successResponse(res, {
        msg: 'Group is modified successfully',
        data: await this.GroupService.edit({ groupId, editGroup }),
      })
    },
  )

  public static readonly changeCover = asyncHandler(
    async (req: IRequest, res: Response) => {
      const group = req.group
      const path = req.file?.path!

      return successResponse(res, {
        msg: 'Group is modified successfully',
        data: await this.GroupService.changeCover({ group, path }),
      })
    },
  )

  public static readonly changeVisibility = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: groupId, isPrivateGroup } = req.group
      await this.GroupService.changeVisibility({
        groupId,
        state: isPrivateGroup,
      })
      return successResponse(res, {
        msg: 'Group Visibility is Changed successfully',
      })
    },
  )

  public static readonly delete = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: groupId } = req.group
      await this.GroupService.delete(groupId)
      return successResponse(res, {
        msg: 'Group is deleted successfully',
      })
    },
  )
}
