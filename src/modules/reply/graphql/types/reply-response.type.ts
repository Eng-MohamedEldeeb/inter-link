import { GraphQLList } from 'graphql'
import {
  returnedResponseType,
  returnedType,
} from '../../../../common/decorators/resolver/returned-type.decorator'
import { replyFields } from './reply-fields.type'
import { IReply } from '../../../../db/interface/IReply.interface'

export const singleReply = returnedType<Omit<IReply, '__v'>>({
  name: 'singleReply',
  fields: replyFields,
})
export class CommentResponse {
  static readonly getPostComments = () => {
    return returnedResponseType({
      name: 'getCommentRepliesResponse',
      data: returnedType<{ replies: IReply[] }>({
        name: 'replies',
        fields: {
          replies: {
            type: new GraphQLList(singleReply),
          },
        },
      }),
    })
  }
}
