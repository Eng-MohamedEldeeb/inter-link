import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'

import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'

import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import postExistenceGuard from '../../../common/guards/post/post-existence.guard'

import {
  IMutationController,
  IQueryController,
} from '../../../common/interface/IGraphQL.interface'
import { StoryQueryResolver, StoryMutationResolver } from './story.resolver'

import { StoryResponse } from './types/story-response.type'

import * as args from './types/story-args.type'
import postAuthorizationGuard from '../../../common/guards/post/post-authorization.guard'
import postSharePermissionGuard from '../../../common/guards/post/post-share-permission.guard'

import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from '../validators/story.validators'

export class StoryController {
  private static readonly StoryQueryResolver = StoryQueryResolver
  private static readonly StoryMutationResolver = StoryMutationResolver

  // Queries:
  static readonly getAll = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getAllStoriesQuery',
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.StoryQueryResolver.getAll,
      }),
    }
  }

  static readonly getSingle = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getSingleStoryQuery',
        data: StoryResponse.getSingle(),
      }),
      args: args.getSingle,
      resolve: applyResolver({
        middlewares: [validate(validators.getSingleValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.StoryQueryResolver.getSingle,
      }),
    }
  }

  // Mutations:

  static readonly deleteStory = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteStoryMutation',
      }),
      args: args.deleteStory,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.StoryMutationResolver.deleteStory,
      }),
    }
  }
}
