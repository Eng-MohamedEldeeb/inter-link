import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { StoryController } from './story.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'storyQuery',
      fields: {
        getAll: StoryController.getAll(),
        getSingle: StoryController.getSingle(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: 'storyMutation',
      fields: {
        like: StoryController.like(),
        deleteStory: StoryController.deleteStory(),
      },
    }),
    resolve: () => true,
  }
})()
