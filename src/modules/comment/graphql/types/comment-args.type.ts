import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import {
  ICommentIdDTO,
  IEditCommentDTO,
  IGetPostCommentsDTO,
} from '../../dto/comment.dto'

export const getPostComments = argsType<IGetPostCommentsDTO>({
  postId: { type: new GraphQLNonNull(GraphQLID) },
})

export const edit = argsType<IEditCommentDTO & ICommentIdDTO>({
  content: { type: new GraphQLNonNull(GraphQLString) },
  commentId: { type: new GraphQLNonNull(GraphQLID) },
})
