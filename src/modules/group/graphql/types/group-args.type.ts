import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'

import * as DTO from '../../dto/chat-group.dto'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'

export const getSingleChat = argsType<DTO.IGetSingle>({
  groupId: { type: new GraphQLNonNull(GraphQLID) },
})

export const likeMessage = argsType<Omit<DTO.ILikeMessage, 'chat'>>({
  groupId: { type: new GraphQLNonNull(GraphQLID) },
  messageId: { type: new GraphQLNonNull(GraphQLID) },
})
export const deleteChat = argsType<Pick<DTO.IDeleteChat, 'groupId'>>({
  groupId: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteMessage = argsType<Omit<DTO.IDeleteMessage, 'group'>>({
  groupId: { type: new GraphQLNonNull(GraphQLID) },
  messageId: { type: new GraphQLNonNull(GraphQLID) },
})
