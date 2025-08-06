import { Response } from 'express'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { successResponse } from '../../../common/handlers/success-response.handler'
import { CommunityService } from '../community.service'
import { PostService } from '../../post/post.service'
import { ICreatePost } from '../../post/dto/post.dto'

import * as DTO from '../dto/community.dto'

export class CommunityController {
  private static readonly CommunityService = CommunityService
  private static readonly PostService = PostService

  public static readonly getCommunity = asyncHandler(
    (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const community = req.community
      return successResponse(res, {
        data: this.CommunityService.getCommunity({ profileId, community }),
      })
    },
  )

  public static readonly create = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.profile
      const cover = req.cloudFile
      const createCommunityDTO: DTO.ICreateCommunity = req.body
      return successResponse(res, {
        status: 201,
        msg: 'Community is created Successfully',
        data: await this.CommunityService.create({
          createdBy: _id,
          createCommunityDTO,
          cover,
        }),
      })
    },
  )

  public static readonly addPost = asyncHandler(
    async (req: IRequest<DTO.IGetCommunity>, res: Response) => {
      const { _id } = req.profile
      const { _id: communityId, name } = req.community

      const attachments = req.cloudFiles
      const createPost: ICreatePost = req.body

      return successResponse(res, {
        status: 201,
        msg: `Post is uploaded to ${name} Community Successfully`,
        data: await this.PostService.create({
          createdBy: _id,
          attachments,
          createPost: {
            ...createPost,
            onCommunity: communityId,
          },
        }),
      })
    },
  )

  public static readonly removePost = asyncHandler(
    async (
      req: IRequest<DTO.IGetCommunity, DTO.IRemovePost>,
      res: Response,
    ) => {
      const { _id: postId } = req.post
      const { _id: communityId, name } = req.community

      await this.PostService.removeFromCommunity({ communityId, postId })

      return successResponse(res, {
        msg: `Post is deleted from ${name} Community Successfully`,
      })
    },
  )

  public static readonly addAdmin = asyncHandler(
    async (req: IRequest<DTO.IGetCommunity>, res: Response) => {
      const { _id: userId, username } = req.user
      const { community } = req

      await this.CommunityService.addAdmin({
        community,
        userId,
      })

      return successResponse(res, {
        msg: `User '${username}' is now a Community Admin`,
      })
    },
  )

  public static readonly removeAdmin = asyncHandler(
    async (req: IRequest<DTO.IGetCommunity>, res: Response) => {
      const { _id: userId, username } = req.user
      const { community } = req

      await this.CommunityService.removeAdmin({
        community,
        userId,
      })

      return successResponse(res, {
        msg: `User '${username}' is not a Community Admin anymore`,
      })
    },
  )

  public static readonly edit = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: communityId } = req.community
      const editCommunity: DTO.IEditCommunity = req.body

      return successResponse(res, {
        msg: 'Community is modified successfully',
        data: await this.CommunityService.edit({ communityId, editCommunity }),
      })
    },
  )

  public static readonly changeCover = asyncHandler(
    async (req: IRequest, res: Response) => {
      const community = req.community
      const path = req.file?.path!

      return successResponse(res, {
        msg: 'Community is modified successfully',
        data: await this.CommunityService.changeCover({ community, path }),
      })
    },
  )

  public static readonly changeVisibility = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: communityId, isPrivateCommunity } = req.community
      await this.CommunityService.changeVisibility({
        communityId,
        state: isPrivateCommunity,
      })
      return successResponse(res, {
        msg: 'Community Visibility is Changed successfully',
      })
    },
  )

  public static readonly delete = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: communityId } = req.community
      await this.CommunityService.delete(communityId)
      return successResponse(res, {
        msg: 'Community is deleted successfully',
      })
    },
  )
}
