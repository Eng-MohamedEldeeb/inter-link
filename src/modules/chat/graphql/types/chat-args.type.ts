import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'

import * as DTO from '../../dto/chat.dto'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'

export const getSingleChat = argsType<DTO.IGetSingleChat>({
  chatId: { type: new GraphQLNonNull(GraphQLID) },
})

export const startChat = argsType<Omit<DTO.IStartChat, 'profileId'>>({
  userId: { type: new GraphQLNonNull(GraphQLID) },
  message: { type: new GraphQLNonNull(GraphQLString) },
})

export const likeMessage = argsType<DTO.ILikeMessage>({
  chatId: { type: new GraphQLNonNull(GraphQLID) },
  messageId: { type: new GraphQLNonNull(GraphQLID) },
})
export const deleteChat = argsType<Pick<DTO.IDeleteChat, 'chatId'>>({
  chatId: { type: new GraphQLNonNull(GraphQLID) },
})
export const deleteMessage = argsType<DTO.IDeleteMessage>({
  chatId: { type: new GraphQLNonNull(GraphQLID) },
  messageId: { type: new GraphQLNonNull(GraphQLID) },
})
