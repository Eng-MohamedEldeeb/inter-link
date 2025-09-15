import {
  graphResponseType,
  returnedType,
} from "../../../../../common/decorators/resolver/returned-type.decorator"

import { IComment } from "../../../../../db/interfaces/IComment.interface"
import { commentFields } from "./comment-fields"

export const singleComment = returnedType<Omit<IComment, "__v">>({
  name: "singleComment",
  fields: commentFields,
})
export class CommentResponse {
  public static readonly getSingleComment = () => {
    return graphResponseType({
      name: "getSingleCommentResponse",
      data: returnedType<{ comment: IComment }>({
        name: "singleCommentResponse",
        fields: {
          comment: {
            type: singleComment,
          },
        },
      }),
    })
  }
}
