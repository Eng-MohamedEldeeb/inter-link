import {
  IMutationController,
  IQueryController,
} from '../../../common/interface/IGraphQL.interface'

import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'
import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'
import { GroupResponse } from './types/group-response.type'
import { validate } from '../../../common/middlewares/validation/validation.middleware'

import * as resolvers from './group.resolver'
import * as args from './types/group-args.type'
import * as validators from '../validators/group.validators'

import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import groupExistenceGuard from '../../../common/guards/group/group-existence.guard'
import groupMembersGuard from '../../../common/guards/group/group-members.guard'

export class GroupController {
  protected static readonly GroupQueryResolver = resolvers.GroupQueryResolver
  protected static readonly GroupMutationResolver =
    resolvers.GroupMutationResolver

  // Queries:
  public static readonly getAllGroups = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getAllGroups',
        data: GroupResponse.getAllGroups(),
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.GroupQueryResolver.getAllGroups,
      }),
    }
  }

  public static readonly getSingleGroup = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getSingleGroup',
        data: GroupResponse.getSingleGroup(),
      }),
      resolve: applyResolver({
        middlewares: [
          validate(validators.getSingleGroupChatValidator.graphql()),
        ],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          groupExistenceGuard,
          groupMembersGuard,
        ],
        resolver: this.GroupQueryResolver.getSingleGroup,
      }),
    }
  }

  // Mutations:
  public static readonly likeGroupMessage = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'likeGroupMessage',
      }),
      args: args.likeMessage,
      resolve: applyResolver({
        middlewares: [validate(validators.likeMessageValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, groupExistenceGuard],
        resolver: this.GroupMutationResolver.likeMessage,
      }),
    }
  }

  public static readonly deleteGroupMessage = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteGroupMessage',
      }),
      args: args.deleteMessage,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteMessageValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, groupExistenceGuard],
        resolver: this.GroupMutationResolver.deleteMessage,
      }),
    }
  }

  public static readonly deleteGroup = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteGroup',
      }),
      args: args.deleteGroup,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteGroupValidator.graphql())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, groupExistenceGuard],
        resolver: this.GroupMutationResolver.deleteGroup,
      }),
    }
  }
}
