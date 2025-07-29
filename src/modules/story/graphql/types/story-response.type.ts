import { GraphQLList } from 'graphql'
import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { storyFields } from './story-fields.type'
import { IStory } from '../../../../db/interfaces/IStory.interface'

export const singleStory = returnedType<Omit<IStory, '__v'>>({
  name: 'singleStory',
  fields: storyFields,
})
export class StoryResponse {
  public static readonly getAll = () => {
    return returnedType<{ stories: IStory[] }>({
      name: 'getAllStoriesResponse',
      fields: {
        stories: {
          type: new GraphQLList(singleStory),
        },
      },
    })
  }

  public static readonly getSingle = () => {
    return returnedType<Omit<IStory, '__v'>>({
      name: 'getSingleStoryResponse',
      fields: storyFields,
    })
  }
}
