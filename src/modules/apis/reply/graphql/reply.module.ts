import { returnedType } from "../../../../common/decorators/resolver/returned-type.decorator"
import replyController from "./reply.controller"

export const queryModule = (() => {
  return {
    type: returnedType({
      name: "replyQuery",
      fields: {
        getCommentReplies: replyController.getCommentReplies(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: "replyMutation",
      fields: {
        edit: replyController.edit(),
        delete: replyController.deleteReply(),
      },
    }),
    resolve: () => true,
  }
})()
