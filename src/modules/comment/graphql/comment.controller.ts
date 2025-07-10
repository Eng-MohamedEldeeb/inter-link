import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'
import {
  IMutationController,
  IQueryController,
} from '../../../common/decorators/resolver/types/IGraphQL.interface'
import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'

import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import postExistenceGuard from '../../../common/guards/post/post-existence.guard'

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
  static readonly getPostComments = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getPostComments',
        data: CommentResponse.getPostComments(),
      }),
      args: args.getPostComments,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.CommentQueryResolver.getPostComments,
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
        middlewares: [validate(validators.editValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.CommentMutationResolver.edit,
      }),
    }
  }
}
