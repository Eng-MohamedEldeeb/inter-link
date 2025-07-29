import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import groupAuthorizationGuard from '../../../common/guards/group/group-owner-authorization.guard'
import groupExistenceGuard from '../../../common/guards/group/group-existence.guard'
import groupAdminsAuthorizationGuard from '../../../common/guards/group/group-admins-authorization.guard'
import postExistenceInGroupGuard from '../../../common/guards/group/post-existence-in-group.guard'

import * as args from './types/group-args.type'
import * as validators from '../validators/group.validators'

import {
  IMutationController,
  IQueryController,
} from '../../../common/interface/IGraphQL.interface'

import { GroupMutationResolver, GroupQueryResolver } from './group.resolver'

import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'
import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'
import { GroupResponse } from './types/group-response.type'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import userExistenceGuard from '../../../common/guards/user/user-existence.guard'

export class GroupController {
  private static readonly GroupQueryResolver = GroupQueryResolver
  private static readonly GroupMutationResolver = GroupMutationResolver

  // Queries:
  public static readonly getGroup = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getGroupPostQuery',
        data: GroupResponse.getGroup(),
      }),
      args: args.getGroup,
      resolve: applyResolver({
        middlewares: [validate(validators.getGroupValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, groupExistenceGuard],
        resolver: this.GroupQueryResolver.getGroup,
      }),
    }
  }

  // Mutations:
  public static readonly addAdmin = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'addAdminMutation',
      }),
      args: args.addAdmin,
      resolve: applyResolver({
        middlewares: [validate(validators.addAdminValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          groupExistenceGuard,
          groupAuthorizationGuard,
          userExistenceGuard,
        ],
        resolver: this.GroupMutationResolver.addAdmin,
      }),
    }
  }

  public static readonly removeAdmin = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'removeAdminMutation',
      }),
      args: args.removeAdmin,
      resolve: applyResolver({
        middlewares: [validate(validators.removeAdminValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          groupExistenceGuard,
          groupAuthorizationGuard,
          userExistenceGuard,
        ],
        resolver: this.GroupMutationResolver.removeAdmin,
      }),
    }
  }

  public static readonly edit = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'editGroupMutation',
      }),
      args: args.edit,
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          groupExistenceGuard,
          groupAuthorizationGuard,
        ],
        resolver: this.GroupMutationResolver.edit,
      }),
    }
  }

  public static readonly changeVisibility = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'changeGroupVisibilityMutation',
      }),
      args: args.changeVisibility,
      resolve: applyResolver({
        middlewares: [validate(validators.changeVisibilityValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          groupExistenceGuard,
          groupAuthorizationGuard,
        ],
        resolver: this.GroupMutationResolver.changeVisibility,
      }),
    }
  }

  public static readonly deleteGroup = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteGroupMutation',
      }),
      args: args.deleteGroup,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteGroupValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          groupExistenceGuard,
          groupAuthorizationGuard,
        ],
        resolver: this.GroupMutationResolver.deleteGroup,
      }),
    }
  }

  public static readonly removePostFromGroup = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'removePostFromGroupMutation',
      }),
      args: args.removePost,
      resolve: applyResolver({
        middlewares: [validate(validators.removePostValidator.graphQL())],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          groupExistenceGuard,
          groupAdminsAuthorizationGuard,
          postExistenceInGroupGuard,
        ],
        resolver: this.GroupMutationResolver.removePostFromGroup,
      }),
    }
  }
}
