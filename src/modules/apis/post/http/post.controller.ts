import { Response } from "express"
import { IRequest } from "../../../../common/interface/IRequest.interface"
import { asyncHandler } from "../../../../common/decorators/async-handler/async-handler.decorator"
import { successResponse } from "../../../../common/handlers/success-response.handler"

import * as DTO from "../dto/post.dto"

import postService from "../post.service"

class PostController {
  private readonly postService = postService

  public readonly getAll = asyncHandler(
    async (req: IRequest<null, DTO.IGetAll>, res: Response) => {
      const query = req.query
      return successResponse(res, {
        data: await this.postService.getAll(query),
      })
    },
  )

  public readonly getSingle = asyncHandler(
    async (req: IRequest<DTO.IGetSinglePost>, res: Response) => {
      const isExistedPost = req.post
      return successResponse(res, {
        data: isExistedPost,
      })
    },
  )

  public readonly create = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id } = req.profile
      const attachments = req.cloudFiles
      const createPost: DTO.ICreatePost = req.body
      return successResponse(res, {
        status: 201,
        msg: "Post Uploaded Successfully",
        data: await this.postService.create({
          createdBy: _id,
          createPost,
          attachments,
        }),
      })
    },
  )

  public readonly edit = asyncHandler(async (req: IRequest, res: Response) => {
    const { _id: postId } = req.post
    const editPost: DTO.IEditPost = req.body

    return successResponse(res, {
      msg: "Post is modified successfully",
      data: await this.postService.edit({ postId, editPost }),
    })
  })

  public readonly save = asyncHandler(async (req: IRequest, res: Response) => {
    const { _id: profileId } = req.profile
    const { _id: postId } = req.post
    await this.postService.save({ postId, profileId })
    return successResponse(res, {
      msg: "Post is Saved successfully",
    })
  })

  public readonly shared = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const { _id: postId, createdBy } = req.post

      if (createdBy.equals(profileId))
        return successResponse(res, {
          msg: "Done",
        })

      await this.postService.shared(postId)

      return successResponse(res, {
        msg: "Post's shares count been updated successfully",
      })
    },
  )

  public readonly like = asyncHandler(async (req: IRequest, res: Response) => {
    const { msg } = await this.postService.like({
      post: req.post,
      profile: req.profile,
    })

    return successResponse(res, { msg })
  })

  public readonly archive = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: postId } = req.post

      await this.postService.archive(postId)

      return successResponse(res, {
        msg: "Post is archived successfully",
      })
    },
  )

  public readonly restore = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: postId } = req.post

      await this.postService.restore(postId)

      return successResponse(res, {
        msg: "Post is restored successfully",
      })
    },
  )

  public readonly delete = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const { _id: postId } = req.post

      await this.postService.delete({ profileId, postId })

      return successResponse(res, {
        msg: "Post is deleted successfully",
      })
    },
  )
}
export default new PostController()
