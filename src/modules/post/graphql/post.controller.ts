import PostSharePermissionGuardGuard from '../../../common/guards/post/post-share-permission.guard'
import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import postExistenceGuard from '../../../common/guards/post/post-existence.guard'
import PostOwnerGuard from '../../../common/guards/post/post-owner.guard'

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
  public static readonly getAll = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getAllPostsQuery',
        data: PostResponse.getAll(),
      }),
      args: args.getAll,
      resolve: applyResolver({
        middlewares: [validate(validators.getAllValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.PostQueryResolver.getAll,
      }),
    }
  }

  public static readonly getSingle = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getSinglePostQuery',
        data: PostResponse.getSingle(),
      }),
      args: args.getSingle,
      resolve: applyResolver({
        middlewares: [validate(validators.getSingleValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostQueryResolver.getSingle,
      }),
    }
  }

  // Mutations:

  public static readonly edit = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'editPostMutation',
      }),
      args: args.edit,
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          postExistenceGuard,
          PostOwnerGuard,
        ],
        resolver: this.PostMutationResolver.edit,
      }),
    }
  }

  public static readonly save = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'savePostMutation',
      }),
      args: args.save,
      resolve: applyResolver({
        middlewares: [validate(validators.saveValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostMutationResolver.save,
      }),
    }
  }

  public static readonly shared = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'sharedPostMutation',
      }),
      args: args.shared,
      resolve: applyResolver({
        middlewares: [validate(validators.sharedValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          postExistenceGuard,
          PostSharePermissionGuardGuard,
        ],
        resolver: this.PostMutationResolver.shared,
      }),
    }
  }

  public static readonly archive = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'archivePostMutation',
      }),
      args: args.archive,
      resolve: applyResolver({
        middlewares: [validate(validators.archiveValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostMutationResolver.archive,
      }),
    }
  }

  public static readonly restore = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'restorePostMutation',
      }),
      args: args.restore,
      resolve: applyResolver({
        middlewares: [validate(validators.restoreValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostMutationResolver.restore,
      }),
    }
  }

  public static readonly deletePost = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deletePostMutation',
      }),
      args: args.deletePost,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.PostMutationResolver.deletePost,
      }),
    }
  }
}
