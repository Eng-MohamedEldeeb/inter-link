import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import userExistenceGuard from '../../../common/guards/user/user-existence.guard'

import * as args from './types/user-args.type'
import * as validators from '../validator/user.validator'

import {
  IMutationController,
  IQueryController,
} from '../../../common/interface/IGraphQL.interface'

import { UserQueryResolver, UserMutationResolver } from './user.resolver'

import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'
import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'
import { UserResponse } from './types/user-response.type'
import { validate } from '../../../common/middlewares/validation/validation.middleware'

export class UserQueryController {
  private static readonly UserQueryResolver = UserQueryResolver
  static readonly getUserProfile = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getUserProfile',
        data: UserResponse.getUserProfile(),
      }),
      args: args.getUserProfile,
      resolve: applyResolver({
        middlewares: [validate(validators.getUserProfileSchema.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard],
        resolver: this.UserQueryResolver.getUserProfile,
      }),
    }
  }

  static readonly getUserFollowers = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getUserFollowers',
        data: UserResponse.getUseFollowers(),
      }),
      args: args.getUserFollowers,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard],
        resolver: this.UserQueryResolver.getUseFollowers,
      }),
    }
  }

  static readonly getUserFollowing = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getUserFollowing',
        data: UserResponse.getUseFollowing(),
      }),
      args: args.getUserFollowing,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard],
        resolver: this.UserQueryResolver.getUseFollowing,
      }),
    }
  }
}

export class UserMutationController {
  private static readonly UserMutationResolver = UserMutationResolver

  static readonly blockUser = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'blockUser',
      }),
      args: args.blockUser,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard],
        middlewares: [validate(validators.blockUserSchema.graphQL())],
        resolver: this.UserMutationResolver.blockUser,
      }),
    }
  }

  static readonly unblockUser = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'unblockUser',
      }),
      args: args.unblockUser,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, userExistenceGuard],
        middlewares: [validate(validators.blockUserSchema.graphQL())],
        resolver: this.UserMutationResolver.unblockUser,
      }),
    }
  }
}
