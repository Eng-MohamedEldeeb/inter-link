import {
  ProfileQueryResolver,
  ProfileMutationResolver,
} from './profile.resolver'
import { applyResolver } from '../../../common/decorators/graphql/apply-resolver.decorator'

import {
  IMutationController,
  IQueryController,
} from '../../../common/decorators/graphql/types/IGraphQL.interface'

import { returnedResponseType } from '../../../common/decorators/graphql/returned-type.decorator'
import { ProfileResponse } from './types/profile-response.type'

import * as args from './types/profile-args.type'

import isAuthenticatedGuard from '../../../common/guards/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/is-authorized.guard'

import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from '../validator/profile.validator'

export class ProfileController {
  private static readonly ProfileQueryResolver = ProfileQueryResolver
  private static readonly ProfileMutationResolver = ProfileMutationResolver

  // Queries:
  static readonly getProfile = (): IQueryController => {
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

  static readonly getFollowers = (): IQueryController => {
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

  static readonly getFollowing = (): IQueryController => {
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

  static readonly getAllSavedPosts = (): IQueryController => {
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
  static readonly updateProfile = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'updateProfile',
        data: ProfileResponse.updateProfileResponse(),
      }),
      args: args.updateProfile,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(validators.updateProfileSchema.graphQL())],
        resolver: this.ProfileMutationResolver.updateProfile,
      }),
    }
  }

  static readonly changeVisibility = (): Omit<IMutationController, 'args'> => {
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

  static readonly changeEmail = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'changeEmail',
      }),
      args: args.changeEmail,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(validators.changeEmailSchema.graphQL())],
        resolver: this.ProfileMutationResolver.changeEmail,
      }),
    }
  }

  static readonly confirmNewEmail = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'confirmNewEmail',
      }),
      args: args.confirmNewEmail,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(validators.confirmNewEmailSchema.graphQL())],
        resolver: this.ProfileMutationResolver.confirmNewEmail,
      }),
    }
  }

  static readonly deleteProfilePic = (): Omit<IMutationController, 'args'> => {
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

  static readonly deactivateAccount = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deactivateAccount',
      }),
      args: args.deactivateAccount,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(validators.deleteAccountSchema.graphQL())],
        resolver: this.ProfileMutationResolver.deactivateAccount,
      }),
    }
  }

  static readonly deleteAccount = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteAccount',
      }),
      args: args.deleteAccount,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(validators.deleteAccountSchema.graphQL())],
        resolver: this.ProfileMutationResolver.deleteAccount,
      }),
    }
  }

  static readonly confirmDeletion = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'confirmDeletion',
      }),
      args: args.confirmDeletion,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        middlewares: [validate(validators.confirmDeletionSchema.graphQL())],
        resolver: this.ProfileMutationResolver.confirmDeletion,
      }),
    }
  }
}
