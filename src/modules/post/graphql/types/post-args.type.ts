import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IEditPostDTO, IGetAllDTO, IGetSinglePostDTO } from '../../dto/post.dto'

export const getAll = argsType<IGetAllDTO>({
  page: { type: GraphQLInt },
  limit: { type: GraphQLInt },
})

export const getSingle = argsType<IGetSinglePostDTO>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const edit = argsType<IGetSinglePostDTO & IEditPostDTO>({
  id: { type: new GraphQLNonNull(GraphQLID) },
  title: { type: GraphQLString },
  content: { type: GraphQLString },
})

export const save = argsType<IGetSinglePostDTO>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const shared = argsType<IGetSinglePostDTO>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const archive = argsType<IGetSinglePostDTO>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const restore = argsType<IGetSinglePostDTO>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const deletePost = argsType<IGetSinglePostDTO>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})
