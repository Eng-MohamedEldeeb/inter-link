import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from "graphql"

import { ChatType, IChat } from "../../../../../db/interfaces/IChat.interface"

import { DateType } from "../../../../../common/types/graphql/graphql.types"
import { returnedType } from "../../../../../common/decorators/resolver/returned-type.decorator"
import {
  IMessage,
  MessageStatus,
} from "../../../../../db/interfaces/IMessage.interface"

const messageDetails = returnedType<Omit<IMessage, "__v">>({
  name: "messageDetails",
  fields: {
    sender: { type: GraphQLID },
    receiver: { type: GraphQLID },
    message: { type: GraphQLString },
    sentAt: { type: GraphQLString },
    chatId: { type: GraphQLID },
    createdAt: { type: DateType },
    updatedAt: { type: DateType },
    status: {
      type: new GraphQLEnumType({
        name: "messageStatus",
        values: {
          sent: {
            value: MessageStatus.sent,
          },
          received: {
            value: MessageStatus.received,
          },
          seen: {
            value: MessageStatus.seen,
          },
        },
      }),
    },

    _id: { type: GraphQLID },
  },
})

export const singleChatFields = returnedType<Omit<IChat, "__v">>({
  name: "singleChat",
  fields: {
    _id: { type: GraphQLID },
    messages: { type: new GraphQLList(messageDetails) },
    newMessages: { type: new GraphQLList(messageDetails) },

    startedBy: { type: GraphQLID },
    participants: { type: new GraphQLList(GraphQLID) },

    createdAt: { type: DateType },
    updatedAt: { type: DateType },
    lastMessage: { type: GraphQLID },

    totalNewMessages: { type: GraphQLInt },

    type: {
      type: new GraphQLEnumType({
        name: "singleChatType",
        values: {
          OTO: {
            value: ChatType.OTO,
          },
          MTM: {
            value: ChatType.MTM,
          },
        },
      }),
    },
  },
})

export const allChats = new GraphQLList(singleChatFields)
