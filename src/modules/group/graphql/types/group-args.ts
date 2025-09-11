// import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql"

// import * as DTO from "../../dto/group.dto"

// import { argsType } from "../../../../common/decorators/resolver/returned-type.decorator"

// export class GroupArgs {
//   public static readonly getSingleChat = argsType<DTO.IGetSingleGroup>({
//     id: { type: new GraphQLNonNull(GraphQLID) },
//   })

//   public static readonly likeMessage = argsType<Omit<DTO.ILikeMessage, "chat">>(
//     {
//       id: { type: new GraphQLNonNull(GraphQLID) },
//       messageId: { type: new GraphQLNonNull(GraphQLID) },
//     },
//   )
//   public static readonly deleteChat = argsType<Pick<DTO.IDeleteGroup, "id">>({
//     id: { type: new GraphQLNonNull(GraphQLID) },
//   })

//   public static readonly deleteMessage = argsType<
//     Omit<DTO.IDeleteMessage, "group">
//   >({
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     messageId: { type: new GraphQLNonNull(GraphQLID) },
//   })

//   public static readonly deleteGroup = argsType<
//     Omit<DTO.IDeleteGroup, "group">
//   >({
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     profileId: { type: new GraphQLNonNull(GraphQLID) },
//   })
// }
