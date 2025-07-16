import postSharePermissionGuard from '../../../common/guards/post/post-share-permission.guard'
import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import postExistenceGuard from '../../../common/guards/post/post-existence.guard'
import postAuthorizationGuard from '../../../common/guards/post/post-authorization.guard'

import * as args from './types/post-args.type'
import * as validators from './../validators/post.validators'

import {
  IMutationController,
  IQueryController,
} from '../../../common/interface/IGraphQL.interface'

import { PostMutationResolver, PostQueryResolver } from './post.resolver'
import { PostResponse } from './types/post-response.type'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'
import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'

export class PostController {
  private static readonly PostQueryResolver = PostQueryResolver
  private static readonly PostMutationResolver = PostMutationResolver

  // Queries:
  static readonly getAll = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getAllPostsQuery',
        data: PostResponse.getAll(),
      }),
      args: args.getAll,
      resolve: applyResolver({
        middlewares: [validate(validators.getAllValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.PostQueryResolver.getAll,
      }),
    }
  }

  static readonly getSingle = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getSinglePostQuery',
        data: PostResponse.getSingle(),
      }),
      args: args.getSingle,
      resolve: applyResolver({
        middlewares: [validate(validators.getSingleValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostQueryResolver.getSingle,
      }),
    }
  }

  // Mutations:

  static readonly edit = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'editPostMutation',
      }),
      args: args.edit,
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphQL())],
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
        name: 'savePostMutation',
      }),
      args: args.save,
      resolve: applyResolver({
        middlewares: [validate(validators.saveValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostMutationResolver.save,
      }),
    }
  }

  static readonly shared = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'sharedPostMutation',
      }),
      args: args.shared,
      resolve: applyResolver({
        middlewares: [validate(validators.sharedValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          postExistenceGuard,
          postSharePermissionGuard,
        ],
        resolver: this.PostMutationResolver.shared,
      }),
    }
  }

  static readonly archive = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'archivePostMutation',
      }),
      args: args.archive,
      resolve: applyResolver({
        middlewares: [validate(validators.archiveValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostMutationResolver.archive,
      }),
    }
  }

  static readonly restore = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'restorePostMutation',
      }),
      args: args.restore,
      resolve: applyResolver({
        middlewares: [validate(validators.restoreValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostMutationResolver.restore,
      }),
    }
  }

  static readonly deletePost = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deletePostMutation',
      }),
      args: args.deletePost,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostMutationResolver.deletePost,
      }),
    }
  }
}
