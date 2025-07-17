import { GraphQLInt, GraphQLList } from 'graphql'

import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IPost } from '../../../../db/interface/IPost.interface'
import { postFields } from './post-fields.type'

export const singlePost = returnedType<
  Omit<IPost, '__v' | 'savedBy' | 'archivedAt'>
>({
  name: 'singlePost',
  fields: postFields,
})
export class PostResponse {
  static readonly getAll = () => {
    return returnedType<{ posts: IPost[]; count: number; page: number }>({
      name: 'getAllResponse',
      fields: {
        posts: {
          type: new GraphQLList(singlePost),
        },
        page: { type: GraphQLInt },
        count: { type: GraphQLInt },
      },
    })
  }

  static readonly getSingle = () => {
    return returnedType<Omit<IPost, '__v' | 'savedBy' | 'archivedAt'>>({
      name: 'getSinglePostResponse',
      fields: postFields,
    })
  }
}
