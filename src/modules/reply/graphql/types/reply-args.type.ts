import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import {
  IDeleteReply,
  IEditReply,
  IGetCommentReplies,
} from '../../dto/reply.dto'

export const getCommentReply = argsType<IGetCommentReplies>({
  commentId: { type: new GraphQLNonNull(GraphQLID) },
})

export const edit = argsType<IEditReply>({
  content: { type: new GraphQLNonNull(GraphQLString) },
  replyId: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteReply = argsType<IDeleteReply>({
  replyId: { type: new GraphQLNonNull(GraphQLID) },
})
