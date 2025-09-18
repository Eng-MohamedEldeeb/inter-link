import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql"

import * as DTO from "../../dto/reply.dto"

import { argsType } from "../../../../../common/decorators/resolver/returned-type.decorator"

export class ReplyArgs {
  public static readonly getCommentReply = argsType<DTO.IGetCommentReplies>({
    commentId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly like = argsType<DTO.ILikeReply>({
    replyId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly edit = argsType<DTO.IEditReply>({
    body: { type: new GraphQLNonNull(GraphQLString) },
    replyId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly deleteReply = argsType<DTO.IDeleteReply>({
    replyId: { type: new GraphQLNonNull(GraphQLID) },
  })
}
