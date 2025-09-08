import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { StoryResponse } from "./types/story-response"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { StoryArgs } from "./types/story-args"

import * as validators from "../validators/story.validators"

import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import {
  isAuthenticatedGuard,
  isAuthorizedGuard,
  userExistenceGuard,
  storyExistenceGuard,
  storyViewPermissionGuard,
  storyOwnerGuard,
} from "../../../common/guards"

import { storyQueryResolver, storyMutationResolver } from "./story.resolver"

class StoryController {
  private readonly storyQueryResolver = storyQueryResolver
  private readonly storyMutationResolver = storyMutationResolver

  // Queries:
  public readonly getAll = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getAllStoriesQuery",
        data: StoryResponse.getAll(),
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard],
        middlewares: [validate(validators.getAllValidator.graphql())],
        resolver: this.storyQueryResolver.getAll,
      }),
    }
  }

  public readonly getSingle = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getSingleStoryQuery",
        data: StoryResponse.getSingle(),
      }),
      args: StoryArgs.getSingle,
      resolve: applyResolver({
        middlewares: [validate(validators.getSingleValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          storyExistenceGuard,
          storyViewPermissionGuard,
        ],
        resolver: this.storyQueryResolver.getSingle,
      }),
    }
  }

  // Mutations:
  public readonly like = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "likeStoryMutation",
      }),
      args: StoryArgs.likeStory,
      resolve: applyResolver({
        middlewares: [validate(validators.likeValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, storyExistenceGuard],
        resolver: this.storyMutationResolver.like,
      }),
    }
  }

  public readonly deleteStory = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "deleteStoryMutation",
      }),
      args: StoryArgs.deleteStory,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          storyExistenceGuard,
          storyOwnerGuard,
        ],
        resolver: this.storyMutationResolver.deleteStory,
      }),
    }
  }
}

export default new StoryController()
