import {
  IContext,
  ISuccessResponse,
} from "../../../common/interface/IGraphQL.interface"

import storyService from "../story.service"

class StoryQueryResolver {
  private readonly storyService = storyService

  public readonly getAll = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: userId } = context.user
    return {
      msg: "done",
      status: 200,
      data: await this.storyService.getAll(userId),
    }
  }

  public readonly getSingle = (_: any, context: IContext): ISuccessResponse => {
    const { story } = context
    return {
      msg: "done",
      status: 200,
      data: story,
    }
  }
}
class StoryMutationResolver {
  private readonly storyService = storyService

  public readonly like = async (_: any, context: IContext) => {
    await this.storyService.like({
      profile: context.profile,
      story: context.story,
    })
    return {
      msg: "SStory is liked successfully",
    }
  }

  public readonly deleteStory = async (_: any, context: IContext) => {
    const { _id: profileId } = context.profile
    const { _id: storyId } = context.story

    return {
      msg: "SStory is deleted successfully",
      status: 200,
      data: await this.storyService.delete({ profileId, storyId }),
    }
  }
}

export const storyQueryResolver = new StoryQueryResolver()
export const storyMutationResolver = new StoryMutationResolver()
