import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import { StoryService } from '../story.service'

export class StoryQueryResolver {
  private static readonly StoryService = StoryService

  static readonly getAll = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: userId } = context.user
    return {
      msg: 'done',
      status: 200,
      data: await this.StoryService.getAll(userId),
    }
  }

  static readonly getSingle = (_: any, context: IContext): ISuccessResponse => {
    const { story } = context
    return {
      msg: 'done',
      status: 200,
      data: story,
    }
  }
}
export class StoryMutationResolver {
  private static readonly StoryService = StoryService

  static readonly like = async (_: any, context: IContext) => {
    await this.StoryService.like({
      profile: context.profile,
      story: context.story,
    })
    return {
      msg: 'SStory is liked successfully',
    }
  }

  static readonly deleteStory = async (_: any, context: IContext) => {
    const { _id: profileId } = context.profile
    const { _id: storyId } = context.story

    return {
      msg: 'SStory is deleted successfully',
      status: 200,
      data: await this.StoryService.delete({ profileId, storyId }),
    }
  }
}
