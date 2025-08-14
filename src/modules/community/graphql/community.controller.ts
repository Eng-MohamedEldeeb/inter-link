import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import userExistenceGuard from '../../../common/guards/user/user-existence.guard'
import communityAuthorizationGuard from '../../../common/guards/community/community-owner-authorization.guard'
import communityExistenceGuard from '../../../common/guards/community/community-existence.guard'
import communityAdminsAuthorizationGuard from '../../../common/guards/community/is-community-admin-.guard'
import postExistenceInCommunityGuard from '../../../common/guards/community/post-existence-in-community.guard'

import * as args from './types/community-args.type'
import * as validators from '../validators/community.validators'

import {
  IMutationController,
  IQueryController,
} from '../../../common/interface/IGraphQL.interface'

import {
  CommunityMutationResolver,
  CommunityQueryResolver,
} from './community.resolver'

import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'
import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'
import { CommunityResponse } from './types/community-response.type'
import { validate } from '../../../common/middlewares/validation/validation.middleware'

export class CommunityController {
  private static readonly CommunityQueryResolver = CommunityQueryResolver
  private static readonly CommunityMutationResolver = CommunityMutationResolver

  // Queries:
  public static readonly getCommunity = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getCommunityPostQuery',
        data: CommunityResponse.getCommunity(),
      }),
      args: args.getCommunity,
      resolve: applyResolver({
        middlewares: [validate(validators.getCommunityValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
        ],
        resolver: this.CommunityQueryResolver.getCommunity,
      }),
    }
  }

  // Mutations:
  public static readonly addAdmin = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'addAdminMutation',
      }),
      args: args.addAdmin,
      resolve: applyResolver({
        middlewares: [validate(validators.addAdminValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          communityAuthorizationGuard,
          userExistenceGuard,
        ],
        resolver: this.CommunityMutationResolver.addAdmin,
      }),
    }
  }

  public static readonly removeAdmin = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'removeAdminMutation',
      }),
      args: args.removeAdmin,
      resolve: applyResolver({
        middlewares: [validate(validators.removeAdminValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          communityAuthorizationGuard,
          userExistenceGuard,
        ],
        resolver: this.CommunityMutationResolver.removeAdmin,
      }),
    }
  }

  public static readonly edit = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'editCommunityMutation',
      }),
      args: args.edit,
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          communityAuthorizationGuard,
        ],
        resolver: this.CommunityMutationResolver.edit,
      }),
    }
  }

  public static readonly changeVisibility = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'changeCommunityVisibilityMutation',
      }),
      args: args.changeVisibility,
      resolve: applyResolver({
        middlewares: [validate(validators.changeVisibilityValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          communityAuthorizationGuard,
        ],
        resolver: this.CommunityMutationResolver.changeVisibility,
      }),
    }
  }

  public static readonly deleteCommunity = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteCommunityMutation',
      }),
      args: args.deleteCommunity,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteCommunityValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          communityAuthorizationGuard,
        ],
        resolver: this.CommunityMutationResolver.deleteCommunity,
      }),
    }
  }

  public static readonly removePostFromCommunity = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'removePostFromCommunityMutation',
      }),
      args: args.removePost,
      resolve: applyResolver({
        middlewares: [validate(validators.removePostValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          communityAdminsAuthorizationGuard,
          postExistenceInCommunityGuard,
        ],
        resolver: this.CommunityMutationResolver.removePostFromCommunity,
      }),
    }
  }
}
