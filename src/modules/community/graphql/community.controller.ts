import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { CommunityResponse } from "./types/community-response.type"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import {
  CommunityMutationResolver,
  CommunityQueryResolver,
} from "./community.resolver"

import * as args from "./types/community-args.type"
import * as validators from "../validators/community.validators"

import isAuthenticatedGuard from "../../../common/guards/auth/is-authenticated.guard"
import isAuthorizedGuard from "../../../common/guards/auth/is-authorized.guard"
import userExistenceGuard from "../../../common/guards/user/user-existence.guard"
import communityExistenceGuard from "../../../common/guards/community/community-existence.guard"
import communityOwnerAuthorizationGuard from "../../../common/guards/community/community-owner-authorization.guard"
import postExistenceInCommunityGuard from "../../../common/guards/community/post-existence-in-community.guard"
import communityConflictedNameGuard from "../../../common/guards/community/community-conflicted-name.guard"
import inCommunityRequestsGuard from "../../../common/guards/community/in-community-requests.guard"
import inCommunityAdminsGuard from "../../../common/guards/community/in-community-admins.guard"

export class CommunityController {
  private static readonly CommunityQueryResolver = CommunityQueryResolver
  private static readonly CommunityMutationResolver = CommunityMutationResolver

  // Queries:
  public static readonly getAllCommunities = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getAllCommunitiesQuery",
        data: CommunityResponse.getAllCommunities(),
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.CommunityQueryResolver.getAllCommunities,
      }),
    }
  }

  public static readonly getCommunity = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getSingleCommunityQuery",
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

  public static readonly getCommunityMembers = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getCommunityMembersQuery",
        data: CommunityResponse.getCommunityMembers(),
      }),
      resolve: applyResolver({
        middlewares: [validate(validators.getCommunityValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
        ],
        resolver: this.CommunityQueryResolver.getCommunityMembers,
      }),
    }
  }
  // Mutations:
  public static readonly create = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "createCommunityMutation",
      }),
      args: args.create,
      resolve: applyResolver({
        middlewares: [validate(validators.createValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityConflictedNameGuard,
        ],
        resolver: this.CommunityMutationResolver.create,
      }),
    }
  }

  public static readonly edit = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "editCommunityMutation",
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
      type: graphResponseType({
        name: "changeCommunityVisibilityMutation",
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
      type: graphResponseType({
        name: "deleteCommunityMutation",
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
      type: graphResponseType({
        name: "removePostFromCommunityMutation",
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

  public static readonly addAdmin = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "addAdminMutation",
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
      type: graphResponseType({
        name: "removeAdminMutation",
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

  public static readonly join = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "joinMutation",
      }),
      args: args.join,
      resolve: applyResolver({
        middlewares: [validate(validators.joinCommunityValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
        ],
        resolver: this.CommunityMutationResolver.join,
      }),
    }
  }

  public static readonly leave = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "leaveMutation",
      }),
      args: args.leave,
      resolve: applyResolver({
        middlewares: [validate(validators.leaveCommunityValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
        ],
        resolver: this.CommunityMutationResolver.leave,
      }),
    }
  }

  public static readonly acceptJoinRequest = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "acceptJoinRequestMutation",
      }),
      args: args.acceptJoinRequest,
      resolve: applyResolver({
        middlewares: [
          validate(validators.acceptJoinRequestValidator.graphql()),
        ],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          userExistenceGuard,
          inCommunityRequestsGuard,
          inCommunityAdminsGuard,
        ],
        resolver: this.CommunityMutationResolver.acceptJoinRequest,
      }),
    }
  }

  public static readonly rejectJoinRequest = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "rejectJoinRequestMutation",
      }),
      args: args.rejectJoinRequest,
      resolve: applyResolver({
        middlewares: [
          validate(validators.rejectJoinRequestValidator.graphql()),
        ],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          userExistenceGuard,
          inCommunityRequestsGuard,
          inCommunityAdminsGuard,
        ],
        resolver: this.CommunityMutationResolver.leave,
      }),
    }
  }

  public static readonly kickOut = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "kickOutMutation",
      }),
      args: args.kickOut,
      resolve: applyResolver({
        middlewares: [validate(validators.kickOutValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          userExistenceGuard,
          inCommunityAdminsGuard,
        ],
        resolver: this.CommunityMutationResolver.kickOut,
      }),
    }
  }
}
