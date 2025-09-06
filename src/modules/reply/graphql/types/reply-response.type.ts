import {
  graphResponseType,
  returnedType,
} from "../../../../common/decorators/resolver/returned-type.decorator"

import { GraphQLList } from "graphql"
import { replyFields } from "./reply-fields.type"
import { IReply } from "../../../../db/interfaces/IReply.interface"

export const singleReply = returnedType<Omit<IReply, "__v">>({
  name: "singleReply",
  fields: replyFields,
})
export class CommentResponse {
  public static readonly getPostComments = () => {
    return graphResponseType({
      name: "getCommentRepliesResponse",
      data: returnedType<{ replies: IReply[] }>({
        name: "replies",
        fields: {
          replies: {
            type: new GraphQLList(singleReply),
          },
        },
      }),
    })
  }
}
