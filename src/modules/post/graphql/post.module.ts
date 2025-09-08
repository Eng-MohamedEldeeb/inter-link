import postController from "./post.controller"
import { returnedType } from "../../../common/decorators/resolver/returned-type.decorator"

export const queryModule = (() => {
  return {
    type: returnedType({
      name: "postQuery",
      fields: {
        getAll: postController.getAll(),
        getSingle: postController.getSingle(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: "postMutation",
      fields: {
        edit: postController.edit(),
        save: postController.save(),
        shared: postController.shared(),
        archive: postController.archive(),
        restore: postController.restore(),
        deletePost: postController.deletePost(),
      },
    }),
    resolve: () => true,
  }
})()
