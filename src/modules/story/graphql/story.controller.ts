import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { StoryResponse } from "./types/story-response"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { StoryArgs } from "./types/story-args"

import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import { storyQueryResolver, storyMutationResolver } from "./story.resolver"

import * as validators from "../validators/story.validators"
import isAuthenticatedGuard from "../../../common/guards/auth/is-authenticated.guard"
import isAuthorizedGuard from "../../../common/guards/auth/is-authorized.guard"
import storyExistenceGuard from "../../../common/guards/story/story-existence.guard"
import storyOwnerGuard from "../../../common/guards/story/story-owner.guard"
import storyViewPermissionGuard from "../../../common/guards/story/story-view-permission.guard"
import userExistenceGuard from "../../../common/guards/user/user-existence.guard"

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
