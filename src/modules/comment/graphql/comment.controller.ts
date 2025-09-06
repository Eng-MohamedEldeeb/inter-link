import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { CommentResponse } from "./types/comment-response.type"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

import * as resolvers from "./comment.resolver"
import * as args from "./types/comment-args.type"
import * as validators from "./../validators/comment.validators"

import isAuthenticatedGuard from "../../../common/guards/auth/is-authenticated.guard"
import isAuthorizedGuard from "../../../common/guards/auth/is-authorized.guard"
import commentExistenceGuard from "../../../common/guards/comment/comment-existence.guard"
import CommentOwnerGuard from "../../../common/guards/comment/comment-owner.guard"

export class CommentController {
  protected static readonly CommentQueryResolver =
    resolvers.CommentQueryResolver
  protected static readonly CommentMutationResolver =
    resolvers.CommentMutationResolver

  // Queries:
  public static readonly getSingleComment = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getPostComments",
        data: CommentResponse.getSingleComment(),
      }),
      args: args.getPostComments,
      resolve: applyResolver({
        middlewares: [validate(validators.addValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.CommentQueryResolver.getSingleComment,
      }),
    }
  }

  // Mutations:
  public static readonly likeComment = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "likeCommentMutation",
      }),
      args: args.like,
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          commentExistenceGuard,
        ],
        resolver: this.CommentMutationResolver.like,
      }),
    }
  }

  public static readonly edit = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "editCommentMutation",
      }),
      args: args.edit,
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          commentExistenceGuard,
          CommentOwnerGuard,
        ],
        resolver: this.CommentMutationResolver.edit,
      }),
    }
  }

  public static readonly deleteComment = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "deleteCommentMutation",
      }),
      args: args.deleteComment,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          commentExistenceGuard,
          CommentOwnerGuard,
        ],
        resolver: this.CommentMutationResolver.deleteComment,
      }),
    }
  }
}
