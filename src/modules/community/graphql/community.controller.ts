import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import userExistenceGuard from '../../../common/guards/user/user-existence.guard'

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
import communityExistenceGuard from '../../../common/guards/community/community-existence.guard'
import communityOwnerAuthorizationGuard from '../../../common/guards/community/community-owner-authorization.guard'
import inCommunityAdminsGuard from '../../../common/guards/community/in-community-admins.guard'
import postExistenceInCommunityGuard from '../../../common/guards/community/post-existence-in-community.guard'

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
        middlewares: [validate(validators.getCommunityValidator.graphql())],
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
        middlewares: [validate(validators.addAdminValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          userExistenceGuard,
          communityOwnerAuthorizationGuard,
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
        middlewares: [validate(validators.removeAdminValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          userExistenceGuard,
          inCommunityAdminsGuard,
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
        middlewares: [validate(validators.editValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          inCommunityAdminsGuard,
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
        middlewares: [validate(validators.changeVisibilityValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          communityOwnerAuthorizationGuard,
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
        middlewares: [validate(validators.deleteCommunityValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          communityOwnerAuthorizationGuard,
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
        middlewares: [validate(validators.removePostValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          inCommunityAdminsGuard,
          postExistenceInCommunityGuard,
        ],
        resolver: this.CommunityMutationResolver.removePostFromCommunity,
      }),
    }
  }
}
