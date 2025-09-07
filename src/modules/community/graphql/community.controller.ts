import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { CommunityResponse } from "./types/community-response"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { CommunityArgs } from "./types/community-args"

import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import {
  communityMutationResolver,
  communityQueryResolver,
} from "./community.resolver"

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

class CommunityController {
  private readonly communityQueryResolver = communityQueryResolver
  private readonly communityMutationResolver = communityMutationResolver

  // Queries:
  public readonly getAllCommunities = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getAllCommunitiesQuery",
        data: CommunityResponse.getAllCommunities(),
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.communityQueryResolver.getAllCommunities,
      }),
    }
  }

  public readonly getCommunity = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getSingleCommunityQuery",
        data: CommunityResponse.getCommunity(),
      }),
      args: CommunityArgs.getCommunity,
      resolve: applyResolver({
        middlewares: [validate(validators.getCommunityValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
        ],
        resolver: this.communityQueryResolver.getCommunity,
      }),
    }
  }

  public readonly getCommunityMembers = (): IQueryController => {
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
        resolver: this.communityQueryResolver.getCommunityMembers,
      }),
    }
  }
  // Mutations:
  public readonly create = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "createCommunityMutation",
      }),
      args: CommunityArgs.create,
      resolve: applyResolver({
        middlewares: [validate(validators.createValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityConflictedNameGuard,
        ],
        resolver: this.communityMutationResolver.create,
      }),
    }
  }

  public readonly edit = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "editCommunityMutation",
      }),
      args: CommunityArgs.edit,
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          inCommunityAdminsGuard,
        ],
        resolver: this.communityMutationResolver.edit,
      }),
    }
  }

  public readonly changeVisibility = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "changeCommunityVisibilityMutation",
      }),
      args: CommunityArgs.changeVisibility,
      resolve: applyResolver({
        middlewares: [validate(validators.changeVisibilityValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          communityOwnerAuthorizationGuard,
        ],
        resolver: this.communityMutationResolver.changeVisibility,
      }),
    }
  }

  public readonly deleteCommunity = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "deleteCommunityMutation",
      }),
      args: CommunityArgs.deleteCommunity,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteCommunityValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          communityOwnerAuthorizationGuard,
        ],
        resolver: this.communityMutationResolver.deleteCommunity,
      }),
    }
  }

  public readonly removePostFromCommunity = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "removePostFromCommunityMutation",
      }),
      args: CommunityArgs.removePost,
      resolve: applyResolver({
        middlewares: [validate(validators.removePostValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          inCommunityAdminsGuard,
          postExistenceInCommunityGuard,
        ],
        resolver: this.communityMutationResolver.removePostFromCommunity,
      }),
    }
  }

  public readonly addAdmin = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "addAdminMutation",
      }),
      args: CommunityArgs.addAdmin,
      resolve: applyResolver({
        middlewares: [validate(validators.addAdminValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          userExistenceGuard,
          communityOwnerAuthorizationGuard,
        ],
        resolver: this.communityMutationResolver.addAdmin,
      }),
    }
  }

  public readonly removeAdmin = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "removeAdminMutation",
      }),
      args: CommunityArgs.removeAdmin,
      resolve: applyResolver({
        middlewares: [validate(validators.removeAdminValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          userExistenceGuard,
          inCommunityAdminsGuard,
        ],
        resolver: this.communityMutationResolver.removeAdmin,
      }),
    }
  }

  public readonly join = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "joinMutation",
      }),
      args: CommunityArgs.join,
      resolve: applyResolver({
        middlewares: [validate(validators.joinCommunityValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
        ],
        resolver: this.communityMutationResolver.join,
      }),
    }
  }

  public readonly leave = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "leaveMutation",
      }),
      args: CommunityArgs.leave,
      resolve: applyResolver({
        middlewares: [validate(validators.leaveCommunityValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
        ],
        resolver: this.communityMutationResolver.leave,
      }),
    }
  }

  public readonly acceptJoinRequest = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "acceptJoinRequestMutation",
      }),
      args: CommunityArgs.acceptJoinRequest,
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
        resolver: this.communityMutationResolver.acceptJoinRequest,
      }),
    }
  }

  public readonly rejectJoinRequest = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "rejectJoinRequestMutation",
      }),
      args: CommunityArgs.rejectJoinRequest,
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
        resolver: this.communityMutationResolver.leave,
      }),
    }
  }

  public readonly kickOut = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "kickOutMutation",
      }),
      args: CommunityArgs.kickOut,
      resolve: applyResolver({
        middlewares: [validate(validators.kickOutValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          communityExistenceGuard,
          userExistenceGuard,
          inCommunityAdminsGuard,
        ],
        resolver: this.communityMutationResolver.kickOut,
      }),
    }
  }
}

export default new CommunityController()
