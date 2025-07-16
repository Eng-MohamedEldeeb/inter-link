import { Response } from 'express'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { GroupService } from '../group.service'
import { PostService } from '../../post/post.service'
import { ICreatePost } from '../../post/dto/post.dto'

import * as DTO from '../dto/group.dto'

export class GroupController {
  private static readonly GroupService = GroupService
  private static readonly PostService = PostService

  static readonly getGroup = asyncHandler((req: IRequest, res: Response) => {
    const { _id: profileId } = req.profile
    const group = req.group
    return successResponse(res, {
      data: this.GroupService.getGroup({ profileId, group }),
    })
  })

  static readonly create = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.profile
      const cover = req.cloudFile
      const createGroup: DTO.ICreateGroup = req.body
      return successResponse(res, {
        status: 201,
        msg: 'Group has been created Successfully',
        data: await this.GroupService.create({
          createdBy: _id,
          createGroup,
          cover,
        }),
      })
    },
  )

  static readonly addPost = asyncHandler(
    async (req: IRequest<DTO.IGetGroup>, res: Response) => {
      const { _id } = req.profile
      const { groupId } = req.params
      const { name } = req.group

      const attachments = req.cloudFiles
      const createPost: ICreatePost = req.body

      return successResponse(res, {
        status: 201,
        msg: `Post has been uploaded to ${name} Group Successfully`,
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

  static readonly removePost = asyncHandler(
    async (req: IRequest<DTO.IGetGroup, DTO.IRemovePost>, res: Response) => {
      const { _id: postId } = req.post
      const { _id: groupId, name } = req.group

      return successResponse(res, {
        status: 201,
        msg: `Post has been deleted from ${name} Group Successfully`,
        data: await this.PostService.removeFromGroup({ groupId, postId }),
      })
    },
  )

  static readonly addAdmin = asyncHandler(
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

  static readonly removeAdmin = asyncHandler(
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

  static readonly edit = asyncHandler(async (req: IRequest, res: Response) => {
    const { _id: groupId } = req.group
    const editGroup: DTO.IEditGroup = req.body

    return successResponse(res, {
      msg: 'Group has been modified successfully',
      data: await this.GroupService.edit({ groupId, editGroup }),
    })
  })

  static readonly changeCover = asyncHandler(
    async (req: IRequest, res: Response) => {
      const group = req.group
      const path = req.file?.path!

      return successResponse(res, {
        msg: 'Group has been modified successfully',
        data: await this.GroupService.changeCover({ group, path }),
      })
    },
  )

  static readonly changeVisibility = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: groupId, isPrivateGroup } = req.group
      await this.GroupService.changeVisibility({
        groupId,
        state: isPrivateGroup,
      })
      return successResponse(res, {
        msg: 'Group Visibility has been Changed successfully',
      })
    },
  )

  static readonly delete = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: groupId } = req.group
      await this.GroupService.delete(groupId)
      return successResponse(res, {
        msg: 'Group has been deleted successfully',
      })
    },
  )
}
