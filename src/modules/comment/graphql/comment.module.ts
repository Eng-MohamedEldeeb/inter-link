import { returnedType } from "../../../common/decorators/resolver/returned-type.decorator"
import commentController from "./comment.controller"

export const queryModule = (() => {
  return {
    type: returnedType({
      name: "commentQuery",
      fields: {
        getSingleComment: commentController.getSingleComment(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: "commentMutation",
      fields: {
        likeComment: commentController.likeComment(),
        edit: commentController.edit(),
        deleteComment: commentController.deleteComment(),
      },
    }),
    resolve: () => true,
  }
})()
