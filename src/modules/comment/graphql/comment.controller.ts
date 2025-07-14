import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'
import {
  IMutationController,
  IQueryController,
} from '../../../common/interface/IGraphQL.interface'
import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'

import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import postExistenceGuard from '../../../common/guards/post/post-existence.guard'
import commentExistenceGuard from '../../../common/guards/comment/comment-existence.guard'
import commentAuthorizationGuard from '../../../common/guards/comment/comment-authorization.guard'

import { CommentResponse } from './types/comment-response.type'

import * as args from './types/comment-args.type'
import {
  CommentMutationResolver,
  CommentQueryResolver,
} from './comment.resolver'

import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from './../validators/comment.validators'

export class CommentController {
  protected static readonly CommentQueryResolver = CommentQueryResolver
  protected static readonly CommentMutationResolver = CommentMutationResolver

  // Queries:
  static readonly getSingleComment = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getPostComments',
        data: CommentResponse.getSingleComment(),
      }),
      args: args.getPostComments,
      resolve: applyResolver({
        middlewares: [validate(validators.addValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.CommentQueryResolver.getSingleComment,
      }),
    }
  }

  // Mutations:
  static readonly edit = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'editCommentMutation',
      }),
      args: args.edit,
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          postExistenceGuard,
          commentExistenceGuard,
          commentAuthorizationGuard,
        ],
        resolver: this.CommentMutationResolver.edit,
      }),
    }
  }

  static readonly deleteComment = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteCommentMutation',
      }),
      args: args.deleteComment,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          postExistenceGuard,
          commentExistenceGuard,
          commentAuthorizationGuard,
        ],
        resolver: this.CommentMutationResolver.deleteComment,
      }),
    }
  }
}
