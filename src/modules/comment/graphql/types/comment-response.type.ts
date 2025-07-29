import {
  returnedResponseType,
  returnedType,
} from '../../../../common/decorators/resolver/returned-type.decorator'

import { IComment } from '../../../../db/interfaces/IComment.interface'
import { commentFields } from './comment-fields.type'

export const singleComment = returnedType<Omit<IComment, '__v'>>({
  name: 'singleComment',
  fields: commentFields,
})
export class CommentResponse {
  public static readonly getSingleComment = () => {
    return returnedResponseType({
      name: 'getSingleCommentResponse',
      data: returnedType<{ comment: IComment }>({
        name: 'singleCommentResponse',
        fields: {
          comment: {
            type: singleComment,
          },
        },
      }),
    })
  }
}
