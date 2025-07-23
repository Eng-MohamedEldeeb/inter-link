import { GraphQLID, GraphQLNonNull } from 'graphql'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IDeleteStory, IGetSingleStory, ILikeStory } from '../../dto/story.dto'

export const getSingle = argsType<IGetSingleStory>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const likeStory = argsType<ILikeStory>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteStory = argsType<IDeleteStory>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})
