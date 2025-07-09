import { returnedResponseType } from '../../../common/decorators/graphql/returned-type.decorator'

import { applyResolver } from '../../../common/decorators/graphql/apply-resolver.decorator'

import isAuthenticatedGuard from '../../../common/guards/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/is-authorized.guard'
import postExistenceGuard from '../../../common/guards/post-existence.guard'

import {
  IMutationController,
  IQueryController,
} from '../../../common/decorators/graphql/types/IGraphQL.interface'
import { PostMutationResolver, PostQueryResolver } from './post.resolver'

import { PostResponse } from './types/post-response.type'

import * as args from './types/post-args.type'
import postAuthorizationGuard from '../../../common/guards/post-authorization.guard'

export class PostController {
  private static readonly PostQueryResolver = PostQueryResolver
  private static readonly PostMutationResolver = PostMutationResolver

  // Queries:
  static readonly getAll = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getAllQuery',
        data: PostResponse.getAll(),
      }),
      args: args.getAll,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.PostQueryResolver.getAll,
      }),
    }
  }

  static readonly getSingle = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getSingleQuery',
        data: PostResponse.getSingle(),
      }),
      args: args.getSingle,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostQueryResolver.getSingle,
      }),
    }
  }

  // Mutations:

  static readonly edit = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'editMutation',
      }),
      args: args.edit,
      resolve: applyResolver({
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          postExistenceGuard,
          postAuthorizationGuard,
        ],
        resolver: this.PostMutationResolver.edit,
      }),
    }
  }

  static readonly save = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'saveMutation',
      }),
      args: args.save,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostMutationResolver.save,
      }),
    }
  }

  static readonly shared = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'sharedMutation',
      }),
      args: args.shared,
      resolve: applyResolver({
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          postExistenceGuard,
          postAuthorizationGuard,
        ],
        resolver: this.PostMutationResolver.shared,
      }),
    }
  }

  static readonly archive = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'archiveMutation',
      }),
      args: args.archive,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostMutationResolver.archive,
      }),
    }
  }

  static readonly restore = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'restoreMutation',
      }),
      args: args.restore,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostMutationResolver.restore,
      }),
    }
  }

  static readonly deletePost = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteMutation',
      }),
      args: args.deletePost,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostMutationResolver.deletePost,
      }),
    }
  }
}
