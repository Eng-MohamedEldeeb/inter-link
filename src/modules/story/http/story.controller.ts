import { Response } from 'express'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { StoryService } from '../story.service'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { ICreateStory } from '../dto/story.dto'

export class StoryController {
  private static readonly StoryService = StoryService

  static readonly getAll = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: userId } = req.user
      return successResponse(res, {
        data: await this.StoryService.getAll(userId),
      })
    },
  )

  static readonly getSingle = asyncHandler(
    async (req: IRequest, res: Response) => {
      const story = req.story
      return successResponse(res, {
        data: story,
      })
    },
  )

  static readonly create = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: createdBy } = req.profile
      const attachment = req.cloudFile
      const createStory: ICreateStory = req.body
      return successResponse(res, {
        status: 201,
        msg: 'Story Uploaded Successfully',
        data: await this.StoryService.create({
          createdBy,
          attachment,
          createStory,
        }),
      })
    },
  )

  static readonly like = asyncHandler(async (req: IRequest, res: Response) => {
    const { msg } = await this.StoryService.like({
      profile: req.profile,
      story: req.story,
    })

    return successResponse(res, { msg })
  })

  static readonly delete = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      const { _id: storyId } = req.story
      await this.StoryService.delete({ profileId, storyId })
      return successResponse(res, {
        msg: 'Story is deleted successfully',
      })
    },
  )
}
