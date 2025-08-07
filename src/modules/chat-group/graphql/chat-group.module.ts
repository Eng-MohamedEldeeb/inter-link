import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { ChatGroupController } from './chat-group.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'chatQuery',
      fields: {
        getAllChats: ChatGroupController.getAllChats(),
        getSingleChat: ChatGroupController.getSingleChat(),
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
        likeMessage: ChatGroupController.likeMessage(),
        deleteMessage: ChatGroupController.deleteMessage(),
        deleteChat: ChatGroupController.deleteChat(),
      },
    }),
    resolve: () => true,
  }
})()
