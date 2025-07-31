import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'

import * as DTO from '../../dto/chat.dto'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'

export const getSingleChat = argsType<DTO.IGetSingleChat>({
  currentChatId: { type: new GraphQLNonNull(GraphQLID) },
})

export const likeMessage = argsType<DTO.ILikeMessage>({
  currentChatId: { type: new GraphQLNonNull(GraphQLID) },
  messageId: { type: new GraphQLNonNull(GraphQLID) },
})
export const deleteChat = argsType<Pick<DTO.IDeleteChat, 'currentChatId'>>({
  currentChatId: { type: new GraphQLNonNull(GraphQLID) },
})
export const deleteMessage = argsType<DTO.IDeleteMessage>({
  currentChatId: { type: new GraphQLNonNull(GraphQLID) },
  messageId: { type: new GraphQLNonNull(GraphQLID) },
})
