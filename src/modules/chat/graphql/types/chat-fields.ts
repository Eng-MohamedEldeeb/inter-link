import { GraphQLEnumType, GraphQLID, GraphQLList, GraphQLString } from "graphql"

import { ChatType, IChat } from "../../../../db/interfaces/IChat.interface"

import { DateType } from "../../../../common/types/graphql/graphql.types"
import { returnedType } from "../../../../common/decorators/resolver/returned-type.decorator"
import { IMessage } from "../../../../db/interfaces/IMessage.interface"

// const messageDetails = returnedType<IMessage>({
//   name: "messageDetails",
//   fields: {
//     from: { type: GraphQLID },
//     to: { type: GraphQLID },
//     message: { type: GraphQLString },
//     sentAt: { type: GraphQLString },
//   },
// })

// export const singleChatFields = returnedType<Omit<IChat, "__v" | "updatedAt">>({
//   name: "singleChat",
//   fields: {
//     _id: { type: GraphQLID },
//     messages: { type: new GraphQLList(messageDetails) },
//     newMessages: { type: new GraphQLList(messageDetails) },

//     startedBy: { type: GraphQLID },
//     participants: { type: new GraphQLList(GraphQLID) },

//     createdAt: { type: DateType },
//     // chatId: { type: GraphQLString },
//     type: {
//       type: new GraphQLEnumType({
//         name: "singleChatType",
//         values: {
//           OTO: {
//             value: ChatType.OTO,
//           },
//           MTM: {
//             value: ChatType.MTM,
//           },
//         },
//       }),
//     },
//   },
// })

// export const allChats = new GraphQLList(singleChatFields)
