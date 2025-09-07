import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql"
import { IEditPost, IGetAll, IGetSinglePost } from "../../dto/post.dto"

import { argsType } from "../../../../common/decorators/resolver/returned-type.decorator"

export class PostArgs {
  public static readonly getAll = argsType<IGetAll>({
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  })

  public static readonly getSingle = argsType<IGetSinglePost>({
    id: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly edit = argsType<IGetSinglePost & IEditPost>({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  })

  public static readonly save = argsType<IGetSinglePost>({
    id: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly shared = argsType<IGetSinglePost>({
    id: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly archive = argsType<IGetSinglePost>({
    id: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly restore = argsType<IGetSinglePost>({
    id: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly deletePost = argsType<IGetSinglePost>({
    id: { type: new GraphQLNonNull(GraphQLID) },
  })
}
