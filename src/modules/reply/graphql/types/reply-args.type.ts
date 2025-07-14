import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import {
  IReplyIdDTO,
  IDeleteReplyDTO,
  IEditReplyDTO,
  IGetCommentRepliesDTO,
} from '../../dto/reply.dto'

export const getCommentReply = argsType<IGetCommentRepliesDTO>({
  commentId: { type: new GraphQLNonNull(GraphQLID) },
})

export const edit = argsType<IEditReplyDTO>({
  content: { type: new GraphQLNonNull(GraphQLString) },
  replyId: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteReply = argsType<IDeleteReplyDTO>({
  replyId: { type: new GraphQLNonNull(GraphQLID) },
})
