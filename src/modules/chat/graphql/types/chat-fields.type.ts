import { GraphQLID, GraphQLList, GraphQLString } from 'graphql'

import {
  IChat,
  IMessageDetails,
} from '../../../../db/interfaces/IChat.interface'

import { DateType } from '../../../../common/types/graphql/graphql.types'
import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'

const messageDetails = returnedType<IMessageDetails>({
  name: 'messageDetails',
  fields: {
    from: { type: GraphQLID },
    to: { type: GraphQLID },
    message: { type: GraphQLString },
    sentAt: { type: GraphQLString },
  },
})

export const singleChatFields = returnedType<Omit<IChat, '__v' | 'updatedAt'>>({
  name: 'singleChat',
  fields: {
    _id: { type: GraphQLID },
    messages: { type: new GraphQLList(messageDetails) },
    unread: { type: new GraphQLList(messageDetails) },

    startedBy: { type: GraphQLID },
    participant: { type: GraphQLID },

    createdAt: { type: DateType },
  },
})

export const allChats = new GraphQLList(singleChatFields)
