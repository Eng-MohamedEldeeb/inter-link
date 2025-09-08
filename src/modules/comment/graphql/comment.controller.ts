import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import {
  isAuthenticatedGuard,
  isAuthorizedGuard,
  commentExistenceGuard,
  commentOwnerGuard,
} from "../../../common/guards"

import * as resolvers from "./comment.resolver"
import * as validators from "./../validators/comment.validators"

import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { CommentResponse } from "./types/comment-response"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { CommentArgs } from "./types/comment-args"

class CommentController {
  private readonly commentQueryResolver = resolvers.commentQueryResolver
  private readonly commentMutationResolver = resolvers.commentMutationResolver

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
          commentOwnerGuard,
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
          commentOwnerGuard,
        ],
        resolver: this.commentMutationResolver.deleteComment,
      }),
    }
  }
}

export default new CommentController()
