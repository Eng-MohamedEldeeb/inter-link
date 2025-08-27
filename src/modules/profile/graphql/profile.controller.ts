import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'

import * as args from './types/profile-args.type'
import * as validators from '../validator/profile.validator'

import {
  ProfileQueryResolver,
  ProfileMutationResolver,
} from './profile.resolver'
import {
  IMutationController,
  IQueryController,
} from '../../../common/interface/IGraphQL.interface'

import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'
import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'
import { ProfileResponse } from './types/profile-response.type'
import { validate } from '../../../common/middlewares/validation/validation.middleware'

export class ProfileController {
  private static readonly ProfileQueryResolver = ProfileQueryResolver
  private static readonly ProfileMutationResolver = ProfileMutationResolver

  // Queries:
  public static readonly getProfile = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getProfile',
        data: ProfileResponse.getProfile(),
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.ProfileQueryResolver.getProfile,
      }),
    }
  }

  public static readonly getFollowers = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getFollowers',
        data: ProfileResponse.getFollowers(),
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.ProfileQueryResolver.getFollowers,
      }),
    }
  }

  public static readonly getFollowing = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getFollowing',
        data: ProfileResponse.getFollowing(),
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.ProfileQueryResolver.getFollowing,
      }),
    }
  }

  public static readonly getAllSavedPosts = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getAllSavedPostsQuery',
        data: ProfileResponse.getAllSavedPosts(),
      }),
      args: args.getAllSavedPosts,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.ProfileQueryResolver.getAllSavedPosts,
      }),
    }
  }

  // Mutations:
  public static readonly updateProfile = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'updateProfile',
        data: ProfileResponse.updateProfileResponse(),
      }),
      args: args.updateProfile,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(validators.updateProfileSchema.graphql())],
        resolver: this.ProfileMutationResolver.updateProfile,
      }),
    }
  }

  public static readonly changeVisibility = (): Omit<
    IMutationController,
    'args'
  > => {
    return {
      type: returnedResponseType({
        name: 'changeVisibility',
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.ProfileMutationResolver.changeVisibility,
      }),
    }
  }

  public static readonly changeEmail = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'changeEmail',
      }),
      args: args.changeEmail,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(validators.changeEmailSchema.graphql())],
        resolver: this.ProfileMutationResolver.changeEmail,
      }),
    }
  }

  public static readonly confirmNewEmail = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'confirmNewEmail',
      }),
      args: args.confirmNewEmail,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(validators.confirmNewEmailSchema.graphql())],
        resolver: this.ProfileMutationResolver.confirmNewEmail,
      }),
    }
  }

  public static readonly deleteProfilePic = (): Omit<
    IMutationController,
    'args'
  > => {
    return {
      type: returnedResponseType({
        name: 'deleteProfilePic',
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.ProfileMutationResolver.deleteProfilePic,
      }),
    }
  }

  public static readonly deactivateAccount = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deactivateAccount',
      }),
      args: args.deactivateAccount,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(validators.deleteAccountSchema.graphql())],
        resolver: this.ProfileMutationResolver.deactivateAccount,
      }),
    }
  }

  public static readonly deleteAccount = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteAccount',
      }),
      args: args.deleteAccount,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(validators.deleteAccountSchema.graphql())],
        resolver: this.ProfileMutationResolver.deleteAccount,
      }),
    }
  }

  public static readonly confirmDeletion = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'confirmDeletion',
      }),
      args: args.confirmDeletion,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(validators.confirmDeletionSchema.graphql())],
        resolver: this.ProfileMutationResolver.confirmDeletion,
      }),
    }
  }
}
