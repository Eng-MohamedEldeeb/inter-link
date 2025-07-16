import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { throwError } from '../../handlers/error-message.handler'

import { IGetSingleStory, IStoryId } from '../../../modules/story/dto/story.dto'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import storyRepository from '../../repositories/story.repository'

class StoryExistenceGuard extends GuardActivator {
  private readonly storyRepository = storyRepository

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSingleStory & IStoryId>()
      const { id, storyId } = req.params

      const isExistedStory = await this.storyRepository.findOne({
        filter: { $or: [{ _id: id }, { _id: storyId }] },
      })

      if (!isExistedStory)
        return throwError({
          msg: 'Un-Existed Story or In-valid Id',
          status: 404,
        })

      req.story = isExistedStory
      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetSingleStory>()
      const { id } = args

      const isExistedStory = await this.storyRepository.findOne({
        filter: { _id: id },
      })

      if (!isExistedStory)
        return throwError({
          msg: 'Un-Existed Story or In-valid Id',
          status: 404,
        })

      context.story = isExistedStory
      return true
    }
  }
}

export default new StoryExistenceGuard()
