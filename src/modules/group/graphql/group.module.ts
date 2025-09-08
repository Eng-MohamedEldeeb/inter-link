import groupController from "./group.controller"
import { returnedType } from "../../../common/decorators/resolver/returned-type.decorator"

export const queryModule = (() => {
  return {
    type: returnedType({
      name: "groupQuery",
      fields: {
        getAllGroups: groupController.getAllGroups(),
        getSingleGroup: groupController.getSingleGroup(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: "groupMutation",
      fields: {
        likeGroupMessage: groupController.likeGroupMessage(),
        deleteGroupMessage: groupController.deleteGroupMessage(),
        deleteGroup: groupController.deleteGroup(),
      },
    }),
    resolve: () => true,
  }
})()
