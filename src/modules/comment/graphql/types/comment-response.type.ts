import { GraphQLList } from 'graphql'
import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IComment } from '../../../../db/interface/IComment.interface'
import { commentFields } from './comment-fields.type'

export const singleComment = returnedType<Omit<IComment, '__v'>>({
  name: 'singleComment',
  fields: commentFields,
})
export class CommentResponse {
  static readonly getPostComments = () => {
    return returnedType<{ comments: IComment[] }>({
      name: 'getComments',
      fields: {
        comments: {
          type: new GraphQLList(singleComment),
        },
      },
    })
  }
}
