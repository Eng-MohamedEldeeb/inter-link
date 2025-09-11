// import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
// import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
// import { GroupResponse } from "./types/group-response"
// import { validate } from "../../../common/middlewares/validation/validation.middleware"
// import { GroupArgs } from "./types/group-args"

// import * as resolvers from "./group.resolver"
// import {GroupValidator} from "../validators"

// import {
//   IMutationController,
//   IQueryController,
// } from "../../../common/interface/IGraphQL.interface"

// import {
//   isAuthenticatedGuard,
//   isAuthorizedGuard,
//   groupExistenceGuard,
//   groupMembersGuard,
// } from "../../../common/guards"

// class GroupController {
//   private readonly groupQueryResolver = resolvers.groupQueryResolver
//   private readonly groupMutationResolver = resolvers.groupMutationResolver

//   // Queries:
//   public readonly getAllGroups = (): IQueryController => {
//     return {
//       type: graphResponseType({
//         name: "getAllGroups",
//         data: GroupResponse.getAllGroups(),
//       }),
//       resolve: applyResolver({
//         guards: [isAuthenticatedGuard, isAuthorizedGuard],
//         resolver: this.groupQueryResolver.getAllGroups,
//       }),
//     }
//   }

//   public readonly getSingleGroup = (): IQueryController => {
//     return {
//       type: graphResponseType({
//         name: "getSingleGroup",
//         data: GroupResponse.getSingleGroup(),
//       }),
//       resolve: applyResolver({
//         middlewares: [
//           validate(GroupValidator.getSingleGroupChatValidator.graphql()),
//         ],
//         guards: [
//           isAuthenticatedGuard,
//           isAuthorizedGuard,
//           groupExistenceGuard,
//           groupMembersGuard,
//         ],
//         resolver: this.groupQueryResolver.getSingleGroup,
//       }),
//     }
//   }

//   // Mutations:
//   public readonly likeGroupMessage = (): IMutationController => {
//     return {
//       type: graphResponseType({
//         name: "likeGroupMessage",
//       }),
//       args: GroupArgs.likeMessage,
//       resolve: applyResolver({
//         middlewares: [validate(GroupValidator.likeMessageValidator.graphql())],
//         guards: [isAuthenticatedGuard, isAuthorizedGuard, groupExistenceGuard],
//         resolver: this.groupMutationResolver.likeMessage,
//       }),
//     }
//   }

//   public readonly deleteGroupMessage = (): IMutationController => {
//     return {
//       type: graphResponseType({
//         name: "deleteGroupMessage",
//       }),
//       args: GroupArgs.deleteMessage,
//       resolve: applyResolver({
//         middlewares: [validate(GroupValidator.deleteMessageValidator.graphql())],
//         guards: [isAuthenticatedGuard, isAuthorizedGuard, groupExistenceGuard],
//         resolver: this.groupMutationResolver.deleteMessage,
//       }),
//     }
//   }

//   public readonly deleteGroup = (): IMutationController => {
//     return {
//       type: graphResponseType({
//         name: "deleteGroup",
//       }),
//       args: GroupArgs.deleteGroup,
//       resolve: applyResolver({
//         middlewares: [validate(GroupValidator.deleteGroupValidator.graphql())],
//         guards: [isAuthenticatedGuard, isAuthorizedGuard, groupExistenceGuard],
//         resolver: this.groupMutationResolver.deleteGroup,
//       }),
//     }
//   }
// }

// export default new GroupController()
