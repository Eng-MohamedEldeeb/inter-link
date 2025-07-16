import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'

import * as DTO from '../../dto/comment.dto'

export const getPostComments = argsType<DTO.IGetPostComments>({
  postId: { type: new GraphQLNonNull(GraphQLID) },
})

export const edit = argsType<DTO.IEditComment>({
  content: { type: new GraphQLNonNull(GraphQLString) },
  commentId: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteComment = argsType<DTO.IDeleteComment>({
  commentId: { type: new GraphQLNonNull(GraphQLID) },
})
