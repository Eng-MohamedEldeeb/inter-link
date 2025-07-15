import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'

import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'

import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import postExistenceGuard from '../../../common/guards/post/post-existence.guard'

import {
  IMutationController,
  IQueryController,
} from '../../../common/interface/IGraphQL.interface'
import { GroupMutationResolver, GroupQueryResolver } from './group.resolver'

import { GroupResponse } from './types/group-response.type'

import * as args from './types/group-args.type'
import groupAuthorizationGuard from '../../../common/guards/group/group-authorization.guard'
import groupExistenceGuard from '../../../common/guards/group/group-existence.guard'

import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from '../validators/group.validators'

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
}
