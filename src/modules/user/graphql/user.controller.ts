import isAuthenticatedGuard from "../../../common/guards/auth/is-authenticated.guard"
import isAuthorizedGuard from "../../../common/guards/auth/is-authorized.guard"
import userExistenceGuard from "../../../common/guards/user/user-existence.guard"

import * as validators from "../validator/user.validator"

import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import { userQueryResolver, userMutationResolver } from "./user.resolver"

import { UserArgs } from "./types/user-args"
import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { UserResponse } from "./types/user-response"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

class UserQueryController {
  private readonly userQueryResolver = userQueryResolver
  public readonly getUserProfile = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getUserProfile",
        data: UserResponse.getUserProfile(),
      }),
      args: UserArgs.getUserProfile,
      resolve: applyResolver({
        middlewares: [validate(validators.getUserProfileSchema.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard],
        resolver: this.userQueryResolver.getUserProfile,
      }),
    }
  }

  public readonly getUserFollowers = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getUserFollowers",
        data: UserResponse.getUseFollowers(),
      }),
      args: UserArgs.getUserFollowers,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard],
        resolver: this.userQueryResolver.getUseFollowers,
      }),
    }
  }

  public readonly getUserFollowing = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getUserFollowing",
        data: UserResponse.getUseFollowing(),
      }),
      args: UserArgs.getUserFollowing,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard],
        resolver: this.userQueryResolver.getUseFollowing,
      }),
    }
  }
}

class UserMutationController {
  private readonly userMutationResolver = userMutationResolver

  public readonly blockUser = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "blockUser",
      }),
      args: UserArgs.blockUser,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard],
        middlewares: [validate(validators.blockUserSchema.graphql())],
        resolver: this.userMutationResolver.blockUser,
      }),
    }
  }

  public readonly unblockUser = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "unblockUser",
      }),
      args: UserArgs.unblockUser,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard],
        middlewares: [validate(validators.blockUserSchema.graphql())],
        resolver: this.userMutationResolver.unblockUser,
      }),
    }
  }
}

export const userQueryController = new UserQueryController()
export const userMutationController = new UserMutationController()
