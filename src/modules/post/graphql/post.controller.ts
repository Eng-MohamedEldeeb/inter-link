import * as validators from "./../validators/post.validators"

import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import {
  isAuthenticatedGuard,
  isAuthorizedGuard,
  postExistenceGuard,
  postOwnerGuard,
  postSharePermissionGuard,
} from "../../../common/guards"

import { PostArgs } from "./types/post-args"
import { postMutationResolver, postQueryResolver } from "./post.resolver"
import { PostResponse } from "./types/post-response"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"

class PostController {
  private readonly postQueryResolver = postQueryResolver
  private readonly postMutationResolver = postMutationResolver

  // Queries:
  public readonly getAll = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getAllPostsQuery",
        data: PostResponse.getAll(),
      }),
      args: PostArgs.getAll,
      resolve: applyResolver({
        middlewares: [validate(validators.getAllValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.postQueryResolver.getAll,
      }),
    }
  }

  public readonly getSingle = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getSinglePostQuery",
        data: PostResponse.getSingle(),
      }),
      args: PostArgs.getSingle,
      resolve: applyResolver({
        middlewares: [validate(validators.getSingleValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.postQueryResolver.getSingle,
      }),
    }
  }

  // Mutations:

  public readonly edit = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "editPostMutation",
      }),
      args: PostArgs.edit,
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          postExistenceGuard,
          postOwnerGuard,
        ],
        resolver: this.postMutationResolver.edit,
      }),
    }
  }

  public readonly save = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "savePostMutation",
      }),
      args: PostArgs.save,
      resolve: applyResolver({
        middlewares: [validate(validators.saveValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.postMutationResolver.save,
      }),
    }
  }

  public readonly shared = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "sharedPostMutation",
      }),
      args: PostArgs.shared,
      resolve: applyResolver({
        middlewares: [validate(validators.sharedValidator.graphql())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          postExistenceGuard,
          postSharePermissionGuard,
        ],
        resolver: this.postMutationResolver.shared,
      }),
    }
  }

  public readonly archive = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "archivePostMutation",
      }),
      args: PostArgs.archive,
      resolve: applyResolver({
        middlewares: [validate(validators.archiveValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.postMutationResolver.archive,
      }),
    }
  }

  public readonly restore = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "restorePostMutation",
      }),
      args: PostArgs.restore,
      resolve: applyResolver({
        middlewares: [validate(validators.restoreValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.postMutationResolver.restore,
      }),
    }
  }

  public readonly deletePost = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "deletePostMutation",
      }),
      args: PostArgs.deletePost,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard],
        resolver: this.postMutationResolver.deletePost,
      }),
    }
  }
}
export default new PostController()
