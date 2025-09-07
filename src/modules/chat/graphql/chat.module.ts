import { returnedType } from "../../../common/decorators/resolver/returned-type.decorator"
import chatController from "./chat.controller"

export const queryModule = (() => {
  return {
    type: returnedType({
      name: "chatQuery",
      fields: {
        getAllChats: chatController.getAllChats(),
        getSingleChat: chatController.getSingleChat(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: "chatMutation",
      fields: {
        likeMessage: chatController.likeMessage(),
        deleteMessage: chatController.deleteMessage(),
        deleteChat: chatController.deleteChat(),
      },
    }),
    resolve: () => true,
  }
})()
