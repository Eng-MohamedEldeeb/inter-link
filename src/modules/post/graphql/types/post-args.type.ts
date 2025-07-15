import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IEditPost, IGetAll, IGetSinglePost } from '../../dto/post.dto'

export const getAll = argsType<IGetAll>({
  page: { type: GraphQLInt },
  limit: { type: GraphQLInt },
})

export const getSingle = argsType<IGetSinglePost>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const edit = argsType<IGetSinglePost & IEditPost>({
  id: { type: new GraphQLNonNull(GraphQLID) },
  title: { type: GraphQLString },
  content: { type: GraphQLString },
})

export const save = argsType<IGetSinglePost>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const shared = argsType<IGetSinglePost>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const archive = argsType<IGetSinglePost>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const restore = argsType<IGetSinglePost>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const deletePost = argsType<IGetSinglePost>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})
