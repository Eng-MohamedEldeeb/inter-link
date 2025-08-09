import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { GroupController } from './group.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'chatQuery',
      fields: {
        getAllChats: GroupController.getAllChats(),
        getSingleChat: GroupController.getSingleChat(),
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
        likeMessage: GroupController.likeMessage(),
        deleteMessage: GroupController.deleteMessage(),
        deleteChat: GroupController.deleteChat(),
      },
    }),
    resolve: () => true,
  }
})()
