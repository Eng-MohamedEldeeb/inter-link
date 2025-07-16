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

export class GroupController {
  private static readonly GroupQueryResolver = GroupQueryResolver
  private static readonly GroupMutationResolver = GroupMutationResolver

  // Queries:
  static readonly getGroup = (): IQueryController => {
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
  static readonly addAdmin = (): IMutationController => {
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
        ],
        resolver: this.GroupMutationResolver.addAdmin,
      }),
    }
  }

  static readonly removeAdmin = (): IMutationController => {
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
        ],
        resolver: this.GroupMutationResolver.removeAdmin,
      }),
    }
  }

  static readonly edit = (): IMutationController => {
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

  static readonly changeVisibility = (): Omit<IMutationController, 'args'> => {
    return {
      type: returnedResponseType({
        name: 'changeGroupVisibilityMutation',
      }),
      resolve: applyResolver({
        middlewares: [validate(validators.editValidator.graphQL())],
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

  static readonly deleteGroup = (): IMutationController => {
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

  static readonly removePostFromGroup = (): IMutationController => {
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
