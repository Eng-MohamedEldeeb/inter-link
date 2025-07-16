import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'

import * as DTO from '../../dto/reply.dto'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'

export const getCommentReply = argsType<DTO.IGetCommentReplies>({
  commentId: { type: new GraphQLNonNull(GraphQLID) },
})

export const edit = argsType<DTO.IEditReply>({
  content: { type: new GraphQLNonNull(GraphQLString) },
  replyId: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteReply = argsType<DTO.IDeleteReply>({
  replyId: { type: new GraphQLNonNull(GraphQLID) },
})
