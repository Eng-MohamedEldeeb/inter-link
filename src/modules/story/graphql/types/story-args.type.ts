import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IGetSingleStoryDTO } from '../../dto/story.dto'

export const getSingle = argsType<IGetSingleStoryDTO>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteStory = argsType<IGetSingleStoryDTO>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})
