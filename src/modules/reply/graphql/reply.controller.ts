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

import { CommentResponse } from './types/reply-response.type'

import * as args from './types/reply-args.type'
import { ReplyMutationResolver, ReplyQueryResolver } from './reply.resolver'

import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from '../validators/reply.validators'

export class ReplyController {
  protected static readonly ReplyQueryResolver = ReplyQueryResolver
  protected static readonly ReplyMutationResolver = ReplyMutationResolver

  // Queries:
  static readonly getCommentReplies = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getCommentReplies',
        data: CommentResponse.getPostComments(),
      }),
      args: args.getCommentReply,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.ReplyQueryResolver.getCommentReplies,
      }),
    }
  }

  // Mutations:
  static readonly edit = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'editReplyMutation',
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
        resolver: this.ReplyMutationResolver.edit,
      }),
    }
  }

  static readonly deleteReply = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteReplyMutation',
      }),
      args: args.deleteReply,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          postExistenceGuard,
          commentExistenceGuard,
          commentAuthorizationGuard,
        ],
        resolver: this.ReplyMutationResolver.deleteReply,
      }),
    }
  }
}
