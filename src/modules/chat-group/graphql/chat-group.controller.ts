import {
  IMutationController,
  IQueryController,
} from '../../../common/interface/IGraphQL.interface'

import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'
import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'
import { ChatResponse } from './types/chat-group-response.type'
import { validate } from '../../../common/middlewares/validation/validation.middleware'

import * as resolvers from './chat-group.resolver'
import * as args from './types/chat-group-args.type'
import * as validators from '../validators/chat-group.validators'

import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import chatExistenceGuard from '../../../common/guards/chat/chat-existence.guard'

export class ChatGroupController {
  protected static readonly ChatQueryResolver = resolvers.ChatQueryResolver
  protected static readonly ChatMutationResolver =
    resolvers.ChatMutationResolver

  // Queries:
  public static readonly getAllChats = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getAllChats',
        data: ChatResponse.getAllChats(),
      }),
      resolve: applyResolver({
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.ChatQueryResolver.getAllChats,
      }),
    }
  }

  public static readonly getSingleChat = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getSingleChat',
        data: ChatResponse.getSingleChat(),
      }),
      resolve: applyResolver({
        middlewares: [validate(validators.getSingleChatValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, chatExistenceGuard],
        resolver: this.ChatQueryResolver.getSingleChat,
      }),
    }
  }

  // Mutations:
  public static readonly likeMessage = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'likeMessage',
      }),
      args: args.likeMessage,
      resolve: applyResolver({
        middlewares: [validate(validators.likeMessageValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, chatExistenceGuard],
        resolver: this.ChatMutationResolver.likeMessage,
      }),
    }
  }

  public static readonly deleteMessage = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteMessage',
      }),
      args: args.deleteMessage,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteMessageValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, chatExistenceGuard],
        resolver: this.ChatMutationResolver.deleteMessage,
      }),
    }
  }

  public static readonly deleteChat = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteChat',
      }),
      args: args.deleteChat,
      resolve: applyResolver({
        middlewares: [validate(validators.deleteChatValidator.graphQL())],
        guards: [isAuthenticatedGuard, isAuthorizedGuard, chatExistenceGuard],
        resolver: this.ChatMutationResolver.deleteChat,
      }),
    }
  }
}
