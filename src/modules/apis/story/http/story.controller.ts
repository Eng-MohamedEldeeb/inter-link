import { Response } from "express"
import { asyncHandler } from "../../../../common/decorators/async-handler/async-handler.decorator"
import { IRequest } from "../../../../common/interface/IRequest.interface"
import storyService from "../story.service"
import { successResponse } from "../../../../common/handlers/success-response.handler"
import { ICreateStory } from "../dto/story.dto"

class StoryController {
  private readonly storyService = storyService

  public readonly getAll = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: userId } = req.user
      return successResponse(res, {
        data: await this.storyService.getAll(userId),
      })
    },
  )

  public readonly getSingle = asyncHandler(
    async (req: IRequest, res: Response) => {
      const story = req.story
      return successResponse(res, {
        data: story,
      })
    },
  )

  public readonly create = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: createdBy } = req.profile
      const attachment = req.cloudFile
      const createStory: ICreateStory = req.body
      return successResponse(res, {
        status: 201,
        msg: "Story Uploaded Successfully",
        data: await this.storyService.create({
          createdBy,
          attachment,
          createStory,
        }),
      })
    },
  )

  public readonly like = asyncHandler(async (req: IRequest, res: Response) => {
    const { msg } = await this.storyService.like({
      profile: req.profile,
      story: req.story,
    })

    return successResponse(res, { msg })
  })

  public readonly delete = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const { _id: storyId } = req.story
      await this.storyService.delete({ profileId, storyId })
      return successResponse(res, {
        msg: "Story is deleted successfully",
      })
    },
  )
}

export default new StoryController()
