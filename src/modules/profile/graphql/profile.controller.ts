import isAuthenticatedGuard from "../../../common/guards/auth/is-authenticated.guard"
import isAuthorizedGuard from "../../../common/guards/auth/is-authorized.guard"
import { ProfileResponse } from "./types/profile-response"

import ProfileArgs from "./types/profile-args"
import { ProfileValidator } from "../../../validators"

import {
  profileQueryResolver,
  profileMutationResolver,
} from "./profile.resolver"
import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

class ProfileController {
  private readonly profileQueryResolver = profileQueryResolver
  private readonly profileMutationResolver = profileMutationResolver

  // Queries:
  public readonly getProfile = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getProfile",
        data: ProfileResponse.getProfile(),
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.profileQueryResolver.getProfile,
      }),
    }
  }

  public readonly getFollowers = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getFollowers",
        data: ProfileResponse.getFollowers(),
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.profileQueryResolver.getFollowers,
      }),
    }
  }

  public readonly getFollowing = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getFollowing",
        data: ProfileResponse.getFollowing(),
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.profileQueryResolver.getFollowing,
      }),
    }
  }

  public readonly getAllSavedPosts = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getAllSavedPostsQuery",
        data: ProfileResponse.getAllSavedPosts(),
      }),
      args: ProfileArgs.getAllSavedPosts,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.profileQueryResolver.getAllSavedPosts,
      }),
    }
  }

  // Mutations:
  public readonly updateProfile = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "updateProfile",
        data: ProfileResponse.updateProfileResponse(),
      }),
      args: ProfileArgs.updateProfile,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(ProfileValidator.updateProfileSchema.graphql())],
        resolver: this.profileMutationResolver.updateProfile,
      }),
    }
  }

  public readonly changeVisibility = (): Omit<IMutationController, "args"> => {
    return {
      type: graphResponseType({
        name: "changeVisibility",
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.profileMutationResolver.changeVisibility,
      }),
    }
  }

  public readonly changeEmail = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "changeEmail",
      }),
      args: ProfileArgs.changeEmail,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(ProfileValidator.changeEmailSchema.graphql())],
        resolver: this.profileMutationResolver.changeEmail,
      }),
    }
  }

  public readonly confirmNewEmail = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "confirmNewEmail",
      }),
      args: ProfileArgs.confirmNewEmail,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [
          validate(ProfileValidator.confirmNewEmailSchema.graphql()),
        ],
        resolver: this.profileMutationResolver.confirmNewEmail,
      }),
    }
  }

  public readonly deleteProfilePic = (): Omit<IMutationController, "args"> => {
    return {
      type: graphResponseType({
        name: "deleteProfilePic",
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.profileMutationResolver.deleteProfilePic,
      }),
    }
  }

  public readonly deactivateAccount = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "deactivateAccount",
      }),
      args: ProfileArgs.deactivateAccount,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(ProfileValidator.deleteAccountSchema.graphql())],
        resolver: this.profileMutationResolver.deactivateAccount,
      }),
    }
  }

  public readonly deleteAccount = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "deleteAccount",
      }),
      args: ProfileArgs.deleteAccount,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(ProfileValidator.deleteAccountSchema.graphql())],
        resolver: this.profileMutationResolver.deleteAccount,
      }),
    }
  }

  public readonly confirmDeletion = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "confirmDeletion",
      }),
      args: ProfileArgs.confirmDeletion,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [
          validate(ProfileValidator.confirmDeletionSchema.graphql()),
        ],
        resolver: this.profileMutationResolver.confirmDeletion,
      }),
    }
  }
}

export default new ProfileController()
