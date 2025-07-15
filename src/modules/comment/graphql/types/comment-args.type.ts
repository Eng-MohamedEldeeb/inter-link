import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import {
  ICommentId,
  IDeleteComment,
  IEditComment,
  IGetPostComments,
} from '../../dto/comment.dto'

export const getPostComments = argsType<IGetPostComments>({
  postId: { type: new GraphQLNonNull(GraphQLID) },
})

export const edit = argsType<IEditComment & ICommentId>({
  content: { type: new GraphQLNonNull(GraphQLString) },
  commentId: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteComment = argsType<IDeleteComment>({
  commentId: { type: new GraphQLNonNull(GraphQLID) },
})
