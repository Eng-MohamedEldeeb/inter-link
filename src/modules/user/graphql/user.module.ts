import { UserQueryController, UserMutationController } from './user.controller'
import { returnedType } from '../../../common/decorators/graphql/returned-type.decorator'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'userQuery',
      fields: {
        getUserProfile: UserQueryController.getUserProfile(),
        getUserFollowers: UserQueryController.getUserFollowers(),
        getUserFollowing: UserQueryController.getUserFollowing(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: 'userMutation',
      fields: {
        blockUser: UserMutationController.blockUser(),
        unblockUser: UserMutationController.unblockUser(),
      },
    }),

    resolve: () => true,
  }
})()
