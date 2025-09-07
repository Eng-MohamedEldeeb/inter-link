import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { CommentResponse } from "./types/comment-response"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

import * as resolvers from "./comment.resolver"
import { CommentArgs } from "./types/comment-args"
import * as validators from "./../validators/comment.validators"

import isAuthenticatedGuard from "../../../common/guards/auth/is-authenticated.guard"
import isAuthorizedGuard from "../../../common/guards/auth/is-authorized.guard"
import commentExistenceGuard from "../../../common/guards/comment/comment-existence.guard"
import CommentOwnerGuard from "../../../common/guards/comment/comment-owner.guard"

class CommentController {
  protected readonly commentQueryResolver = resolvers.commentQueryResolver
  protected readonly commentMutationResolver = resolvers.commentMutationResolver

  // Queries:
  public readonly getSingleComment = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getPostComments",
        data: CommentResponse.getSingleComment(),
      }),
      args: CommentArgs.getPostComments,
      resolve: applyResolver({
        middlewares: [validate(validators.addValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.commentQueryResolver.getSingleComment,
      }),
    }
  }

  // Mutations:
  public readonly likeComment = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "likeCommentMutation",
      }),
      args: CommentArgs.like,
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          commentExistenceGuard,
        ],
        resolver: this.commentMutationResolver.like,
      }),
    }
  }

  public readonly edit = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "editCommentMutation",
      }),
      args: CommentArgs.edit,
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          commentExistenceGuard,
          CommentOwnerGuard,
        ],
        resolver: this.commentMutationResolver.edit,
      }),
    }
  }

  public readonly deleteComment = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "deleteCommentMutation",
      }),
      args: CommentArgs.deleteComment,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          commentExistenceGuard,
          CommentOwnerGuard,
        ],
        resolver: this.commentMutationResolver.deleteComment,
      }),
    }
  }
}

export default new CommentController()
