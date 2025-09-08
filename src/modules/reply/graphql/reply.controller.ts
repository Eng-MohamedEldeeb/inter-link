import * as resolvers from "./reply.resolver"
import * as validators from "../validators/reply.validators"

import {
  isAuthenticatedGuard,
  isAuthorizedGuard,
  replyExistenceGuard,
  replyOwnerGuard,
} from "../../../common/guards"

import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { CommentResponse } from "./types/reply-response"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { ReplyArgs } from "./types/reply-args"

class ReplyController {
  private readonly replyQueryResolver = resolvers.replyQueryResolver
  private readonly replyMutationResolver = resolvers.replyMutationResolver

  // Queries:
  public readonly getCommentReplies = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getCommentReplies",
        data: CommentResponse.getPostComments(),
      }),
      args: ReplyArgs.getCommentReply,
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.replyQueryResolver.getCommentReplies,
      }),
    }
  }

  // Mutations:
  public readonly like = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "likeReplyMutation",
      }),
      args: ReplyArgs.like,
      resolve: applyResolver({
        middlewares: [validate(validators.likeValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, replyExistenceGuard],
        resolver: this.replyMutationResolver.like,
      }),
    }
  }

  public readonly edit = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "editReplyMutation",
      }),
      args: ReplyArgs.edit,
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          replyExistenceGuard,
          replyOwnerGuard,
        ],
        resolver: this.replyMutationResolver.edit,
      }),
    }
  }

  public readonly deleteReply = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "deleteReplyMutation",
      }),
      args: ReplyArgs.deleteReply,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          replyExistenceGuard,
          replyOwnerGuard,
        ],
        resolver: this.replyMutationResolver.deleteReply,
      }),
    }
  }
}
export default new ReplyController()
