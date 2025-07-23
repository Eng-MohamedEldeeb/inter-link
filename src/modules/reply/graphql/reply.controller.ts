import {
  IMutationController,
  IQueryController,
} from '../../../common/interface/IGraphQL.interface'

import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'
import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'
import { CommentResponse } from './types/reply-response.type'
import { validate } from '../../../common/middlewares/validation/validation.middleware'

import * as resolvers from './reply.resolver'
import * as args from './types/reply-args.type'
import * as validators from '../validators/reply.validators'

import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import commentExistenceGuard from '../../../common/guards/comment/comment-existence.guard'
import commentAuthorizationGuard from '../../../common/guards/comment/comment-authorization.guard'

export class ReplyController {
  protected static readonly ReplyQueryResolver = resolvers.ReplyQueryResolver
  protected static readonly ReplyMutationResolver =
    resolvers.ReplyMutationResolver

  // Queries:
  static readonly getCommentReplies = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getCommentReplies',
        data: CommentResponse.getPostComments(),
      }),
      args: args.getCommentReply,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.ReplyQueryResolver.getCommentReplies,
      }),
    }
  }

  // Mutations:
  static readonly like = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'likeReplyMutation',
      }),
      args: args.like,
      resolve: applyResolver({
        middlewares: [validate(validators.likeValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          commentExistenceGuard,
          commentAuthorizationGuard,
        ],
        resolver: this.ReplyMutationResolver.like,
      }),
    }
  }

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
          commentExistenceGuard,
          commentAuthorizationGuard,
        ],
        resolver: this.ReplyMutationResolver.deleteReply,
      }),
    }
  }
}
