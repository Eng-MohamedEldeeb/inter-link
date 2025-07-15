import { GraphQLID, GraphQLNonNull } from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IGetSingleStory } from '../../dto/story.dto'

export const getSingle = argsType<IGetSingleStory>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteStory = argsType<IGetSingleStory>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})
