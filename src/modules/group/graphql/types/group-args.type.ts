import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'

import * as DTO from '../../dto/group.dto'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'

export const getSingleChat = argsType<DTO.IGetSingleGroup>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const likeMessage = argsType<Omit<DTO.ILikeMessage, 'chat'>>({
  id: { type: new GraphQLNonNull(GraphQLID) },
  messageId: { type: new GraphQLNonNull(GraphQLID) },
})
export const deleteChat = argsType<Pick<DTO.IDeleteGroup, 'id'>>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteMessage = argsType<Omit<DTO.IDeleteMessage, 'group'>>({
  id: { type: new GraphQLNonNull(GraphQLID) },
  messageId: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteGroup = argsType<Omit<DTO.IDeleteGroup, 'group'>>({
  id: { type: new GraphQLNonNull(GraphQLID) },
  profileId: { type: new GraphQLNonNull(GraphQLID) },
})
