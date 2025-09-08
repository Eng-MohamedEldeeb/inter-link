import storyController from "./story.controller"
import { returnedType } from "../../../common/decorators/resolver/returned-type.decorator"

export const queryModule = (() => {
  return {
    type: returnedType({
      name: "storyQuery",
      fields: {
        getAll: storyController.getAll(),
        getSingle: storyController.getSingle(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: "storyMutation",
      fields: {
        like: storyController.like(),
        deleteStory: storyController.deleteStory(),
      },
    }),
    resolve: () => true,
  }
})()
