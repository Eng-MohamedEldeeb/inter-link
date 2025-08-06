import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { ChatController } from './chat.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'chatQuery',
      fields: {
        getAllChats: ChatController.getAllChats(),
        getSingleChat: ChatController.getSingleChat(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: 'chatMutation',
      fields: {
        likeMessage: ChatController.likeMessage(),
        deleteMessage: ChatController.deleteMessage(),
        deleteChat: ChatController.deleteChat(),
      },
    }),
    resolve: () => true,
  }
})()
