import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { StoryResponse } from "./types/story-response.type"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import { StoryQueryResolver, StoryMutationResolver } from "./story.resolver"

import * as args from "./types/story-args.type"
import * as validators from "../validators/story.validators"

import isAuthenticatedGuard from "../../../common/guards/auth/is-authenticated.guard"
import isAuthorizedGuard from "../../../common/guards/auth/is-authorized.guard"
import storyExistenceGuard from "../../../common/guards/story/story-existence.guard"
import storyOwnerGuard from "../../../common/guards/story/story-owner.guard"
import storyViewPermissionGuard from "../../../common/guards/story/story-view-permission.guard"
import userExistenceGuard from "../../../common/guards/user/user-existence.guard"

export class StoryController {
  private static readonly StoryQueryResolver = StoryQueryResolver
  private static readonly StoryMutationResolver = StoryMutationResolver

  // Queries:
  public static readonly getAll = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getAllStoriesQuery",
        data: StoryResponse.getAll(),
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard],
        middlewares: [validate(validators.getAllValidator.graphql())],
        resolver: this.StoryQueryResolver.getAll,
      }),
    }
  }

  public static readonly getSingle = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getSingleStoryQuery",
        data: StoryResponse.getSingle(),
      }),
      args: args.getSingle,
      resolve: applyResolver({
        middlewares: [validate(validators.getSingleValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          storyExistenceGuard,
          storyViewPermissionGuard,
        ],
        resolver: this.StoryQueryResolver.getSingle,
      }),
    }
  }

  // Mutations:
  public static readonly like = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "likeStoryMutation",
      }),
      args: args.likeStory,
      resolve: applyResolver({
        middlewares: [validate(validators.likeValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, storyExistenceGuard],
        resolver: this.StoryMutationResolver.like,
      }),
    }
  }

  public static readonly deleteStory = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "deleteStoryMutation",
      }),
      args: args.deleteStory,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          storyExistenceGuard,
          storyOwnerGuard,
        ],
        resolver: this.StoryMutationResolver.deleteStory,
      }),
    }
  }
}
