import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { GroupController } from './group.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'groupQuery',
      fields: {
        getAllGroups: GroupController.getAllGroups(),
        getSingleGroup: GroupController.getSingleGroup(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: 'groupMutation',
      fields: {
        likeGroupMessage: GroupController.likeGroupMessage(),
        deleteGroupMessage: GroupController.deleteGroupMessage(),
        deleteGroup: GroupController.deleteGroup(),
      },
    }),
    resolve: () => true,
  }
})()
