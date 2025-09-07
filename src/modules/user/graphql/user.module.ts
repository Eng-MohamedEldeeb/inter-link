import { userQueryController, userMutationController } from "./user.controller"

import { returnedType } from "../../../common/decorators/resolver/returned-type.decorator"

export const queryModule = (() => {
  return {
    type: returnedType({
      name: "userQuery",
      fields: {
        getUserProfile: userQueryController.getUserProfile(),
        getUserFollowers: userQueryController.getUserFollowers(),
        getUserFollowing: userQueryController.getUserFollowing(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: "userMutation",
      fields: {
        blockUser: userMutationController.blockUser(),
        unblockUser: userMutationController.unblockUser(),
      },
    }),

    resolve: () => true,
  }
})()
