import { GraphQLID, GraphQLNonNull } from "graphql"

import { argsType } from "../../../../../common/decorators/resolver/returned-type.decorator"
import { IDeleteStory, IGetSingleStory, ILikeStory } from "../../dto/story.dto"

export class StoryArgs {
  public static readonly getSingle = argsType<IGetSingleStory>({
    id: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly likeStory = argsType<ILikeStory>({
    id: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly deleteStory = argsType<IDeleteStory>({
    id: { type: new GraphQLNonNull(GraphQLID) },
  })
}
