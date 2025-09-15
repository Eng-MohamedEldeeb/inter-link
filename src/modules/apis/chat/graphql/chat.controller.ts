// import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
// import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
// import { ChatResponse } from "./types/chat-response"
// import { validate } from "../../../common/middlewares/validation/validation.middleware"
// import { ChatArgs } from "./types/chat-args"

// import * as resolvers from "./chat.resolver"
// import {ChatValidator} from "../validators"

// import {
//   IMutationController,
//   IQueryController,
// } from "../../../common/interface/IGraphQL.interface"

// import {
//   isAuthenticatedGuard,
//   isAuthorizedGuard,
//   chatExistenceGuard,
// } from "../../../common/guards"

// class ChatController {
//   private readonly chatQueryResolver = resolvers.chatQueryResolver
//   private readonly chatMutationResolver = resolvers.chatMutationResolver

//   // Queries:
//   public readonly getAllChats = (): IQueryController => {
//     return {
//       type: graphResponseType({
//         name: "getAllChats",
//         data: ChatResponse.getAllChats(),
//       }),
//       resolve: applyResolver({
//         guards: [isAuthenticatedGuard, isAuthorizedGuard],
//         resolver: this.chatQueryResolver.getAllChats,
//       }),
//     }
//   }

//   public readonly getSingleChat = (): IQueryController => {
//     return {
//       type: graphResponseType({
//         name: "getSingleChat",
//         data: ChatResponse.getSingleChat(),
//       }),
//       resolve: applyResolver({
//         middlewares: [validate(validators.getSingleChatValidator.graphql())],
//         guards: [isAuthenticatedGuard, isAuthorizedGuard, chatExistenceGuard],
//         resolver: this.chatQueryResolver.getSingleChat,
//       }),
//     }
//   }

//   // Mutations:
//   public readonly likeMessage = (): IMutationController => {
//     return {
//       type: graphResponseType({
//         name: "likeMessage",
//       }),
//       args: ChatArgs.likeMessage,
//       resolve: applyResolver({
//         middlewares: [validate(validators.likeMessageValidator.graphql())],
//         guards: [isAuthenticatedGuard, isAuthorizedGuard, chatExistenceGuard],
//         resolver: this.chatMutationResolver.likeMessage,
//       }),
//     }
//   }

//   public readonly deleteMessage = (): IMutationController => {
//     return {
//       type: graphResponseType({
//         name: "deleteMessage",
//       }),
//       args: ChatArgs.deleteMessage,
//       resolve: applyResolver({
//         middlewares: [validate(validators.deleteMessageValidator.graphql())],
//         guards: [isAuthenticatedGuard, isAuthorizedGuard, chatExistenceGuard],
//         resolver: this.chatMutationResolver.deleteMessage,
//       }),
//     }
//   }

//   public readonly deleteChat = (): IMutationController => {
//     return {
//       type: graphResponseType({
//         name: "deleteChat",
//       }),
//       args: ChatArgs.deleteChat,
//       resolve: applyResolver({
//         middlewares: [validate(validators.deleteChatValidator.graphql())],
//         guards: [isAuthenticatedGuard, isAuthorizedGuard, chatExistenceGuard],
//         resolver: this.chatMutationResolver.deleteChat,
//       }),
//     }
//   }
// }

// export default new ChatController()
