import { Response } from "express"
import { IRequest } from "../../../common/interface/IRequest.interface"
import { asyncHandler } from "../../../common/decorators/async-handler/async-handler.decorator"
import { successResponse } from "../../../common/handlers/success-response.handler"
import { ICreatePost } from "../../post/dto/post.dto"

import * as DTO from "../dto/community.dto"

import communityService from "../community.service"
import postService from "../../post/post.service"

class CommunityController {
  private readonly communityService = communityService
  private readonly postService = postService

  public readonly getAllCommunities = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const community = req.community

      return successResponse(res, {
        data: await this.communityService.getAllCommunities(),
      })
    },
  )

  public readonly getCommunity = asyncHandler(
    (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const community = req.community

      return successResponse(res, {
        data: this.communityService.getCommunity({ profileId, community }),
      })
    },
  )

  public readonly getCommunityMembers = asyncHandler(
    (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const community = req.community

      return successResponse(res, {
        data: this.communityService.getCommunityMembers({
          profileId,
          community,
        }),
      })
    },
  )

  public readonly create = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.profile
      const cover = req.cloudFile
      const createCommunityDTO: DTO.ICreateCommunity = req.body
      return successResponse(res, {
        status: 201,
        msg: "Community is created Successfully",
        data: await this.communityService.create({
          createdBy: _id,
          createCommunityDTO,
          cover,
        }),
      })
    },
  )

  public readonly addPost = asyncHandler(
    async (req: IRequest<DTO.IGetCommunity>, res: Response) => {
      const { _id } = req.profile
      const { _id: communityId, name } = req.community

      const attachments = req.cloudFiles
      const createPost: ICreatePost = req.body

      return successResponse(res, {
        status: 201,
        msg: `Post is uploaded to ${name} Community Successfully`,
        data: await this.postService.create({
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

  public readonly removePost = asyncHandler(
    async (
      req: IRequest<DTO.IGetCommunity, DTO.IRemovePost>,
      res: Response,
    ) => {
      const { _id: postId } = req.post
      const { _id: communityId, name } = req.community

      await this.postService.removeFromCommunity({ communityId, postId })

      return successResponse(res, {
        msg: `Post is deleted from ${name} Community Successfully`,
      })
    },
  )

  public readonly editCommunity = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: communityId } = req.community
      const editCommunity: DTO.IEditCommunity = req.body

      return successResponse(res, {
        msg: "Community is modified successfully",
        data: await this.communityService.editCommunity({
          communityId,
          editCommunity,
        }),
      })
    },
  )

  public readonly changeCover = asyncHandler(
    async (req: IRequest, res: Response) => {
      const community = req.community
      const path = req.file?.path!

      return successResponse(res, {
        msg: "Community Cover has been modified successfully",
        data: await this.communityService.changeCover({ community, path }),
      })
    },
  )

  public readonly changeVisibility = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: communityId, isPrivateCommunity } = req.community
      await this.communityService.changeVisibility({
        communityId,
        state: isPrivateCommunity,
      })
      return successResponse(res, {
        msg: "Community Visibility is Changed successfully",
      })
    },
  )

  public readonly deleteCommunity = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: communityId } = req.community
      await this.communityService.deleteCommunity(communityId)
      return successResponse(res, {
        msg: "Community is deleted successfully",
      })
    },
  )

  public join = asyncHandler(
    async (req: IRequest<DTO.IGetCommunity>, res: Response) => {
      const profile = req.profile
      const community = req.community

      return successResponse(res, {
        msg: await this.communityService.join({
          profile,
          community,
        }),
      })
    },
  )

  public acceptJoinRequest = asyncHandler(
    async (req: IRequest<DTO.IGetCommunity>, res: Response) => {
      const user = req.user
      const community = req.community

      await this.communityService.acceptJoinRequest({
        user,
        community,
      })

      return successResponse(res, {
        msg: "Join Request Has Been Accepted Successfully",
      })
    },
  )

  public rejectJoinRequest = asyncHandler(
    async (req: IRequest<DTO.IGetCommunity>, res: Response) => {
      const user = req.user
      const community = req.community

      await this.communityService.rejectJoinRequest({
        user,
        community,
      })

      return successResponse(res, {
        msg: "Join Request Has Been Rejected Successfully",
      })
    },
  )

  public leave = asyncHandler(
    async (req: IRequest<DTO.IGetCommunity>, res: Response) => {
      const { _id: profileId } = req.profile
      const { name } = req.community

      await this.communityService.leave({
        profileId,
        community: req.community,
      })

      return successResponse(res, {
        msg: `We are sorry to See you leaving "${name}" Community `,
      })
    },
  )

  public readonly addAdmin = asyncHandler(
    async (req: IRequest<DTO.IGetCommunity>, res: Response) => {
      const { _id: userId, username } = req.user
      const { _id: communityId } = req.community

      await this.communityService.addAdmin({
        communityId,
        userId,
      })

      return successResponse(res, {
        msg: `User '${username}' is now a Community Admin`,
      })
    },
  )

  public readonly removeAdmin = asyncHandler(
    async (req: IRequest<DTO.IGetCommunity>, res: Response) => {
      const admin = req.user
      const community = req.community

      await this.communityService.removeAdmin({
        community,
        admin,
      })

      return successResponse(res, {
        msg: `User '${admin.username}' is not a Community Admin anymore`,
      })
    },
  )

  public kickOut = asyncHandler(
    async (req: IRequest<DTO.IGetCommunity>, res: Response) => {
      const community = req.community
      const user = req.user

      await this.communityService.kickOut({
        user,
        community,
      })

      return successResponse(res, {
        msg: `User ${user.username} has been kicked out successfully`,
      })
    },
  )
}
export default new CommunityController()
