import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { GroupController } from './group.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'groupQuery',
      fields: {
        getGroup: GroupController.getGroup(),
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
        addAdmin: GroupController.addAdmin(),
        removeAdmin: GroupController.removeAdmin(),
        edit: GroupController.edit(),
        changeVisibility: GroupController.changeVisibility(),
        deleteGroup: GroupController.deleteGroup(),
        removePostFromGroup: GroupController.removePostFromGroup(),
      },
    }),
    resolve: () => true,
  }
})()
