import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql"

import { argsType } from "../../../../common/decorators/resolver/returned-type.decorator"
import { IPostId } from "../../../post/dto/post.dto"

import * as DTO from "../../dto/comment.dto"

export class CommentArgs {
  public static readonly getPostComments = argsType<IPostId>({
    postId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly like = argsType<DTO.ILikeComment>({
    id: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly edit = argsType<DTO.IEditComment>({
    content: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly deleteComment = argsType<DTO.IDeleteComment>({
    id: { type: new GraphQLNonNull(GraphQLID) },
  })
}
