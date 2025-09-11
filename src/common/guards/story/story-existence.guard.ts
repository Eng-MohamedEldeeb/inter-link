import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { throwError } from "../../handlers/error-message.handler"
import { MongoId } from "../../types/db"

import { IGetSingleStory, IStoryId } from "../../../modules/story/dto/story.dto"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import storyRepository from "../../repositories/story.repository"

class StoryExistenceGuard extends GuardActivator {
  private readonly storyRepository = storyRepository
  private id: MongoId | undefined = undefined
  private storyId: MongoId | undefined = undefined

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSingleStory & IStoryId>()
      const { id, storyId } = req.params

      this.id = id
      this.storyId = storyId

      req.story = await this.getStoryDetails()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetSingleStory>()
      const { id } = args

      this.id = id

      context.story = await this.getStoryDetails()
    }

    return true
  }

  private readonly getStoryDetails = async () => {
    const isExistedStory = await this.storyRepository.findOne({
      filter: { $or: [{ _id: this.id }, { _id: this.storyId }] },
    })

    if (!isExistedStory)
      return throwError({
        msg: "Un-Existed Story or Invalid Id",
        status: 404,
      })

    return isExistedStory
  }
}

export default new StoryExistenceGuard()
