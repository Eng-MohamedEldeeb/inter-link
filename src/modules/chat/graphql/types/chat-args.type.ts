import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'

import * as DTO from '../../dto/chat.dto'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'

export const getSingleChat = argsType<DTO.IGetSingleChat>({
  chatId: { type: new GraphQLNonNull(GraphQLID) },
})

export const likeMessage = argsType<Omit<DTO.ILikeMessage, 'chat'>>({
  chatId: { type: new GraphQLNonNull(GraphQLID) },
  messageId: { type: new GraphQLNonNull(GraphQLID) },
})
export const deleteChat = argsType<Pick<DTO.IDeleteChat, 'chatId'>>({
  chatId: { type: new GraphQLNonNull(GraphQLID) },
})
export const deleteMessage = argsType<Omit<DTO.IDeleteMessage, 'chat'>>({
  chatId: { type: new GraphQLNonNull(GraphQLID) },
  messageId: { type: new GraphQLNonNull(GraphQLID) },
})
