import { GraphQLObjectType } from 'graphql'
import { ProfileController } from './profile.controller'

export const queryModule = (() => {
  return {
    type: new GraphQLObjectType({
      name: 'profileQuery',
      fields: {
        getProfile: ProfileController.getProfile(),
        getFollowers: ProfileController.getFollowers(),
        getFollowing: ProfileController.getFollowing(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: new GraphQLObjectType({
      name: 'profileMutation',
      fields: {
        updateProfile: ProfileController.updateProfile(),
        changeVisibility: ProfileController.changeVisibility(),
        deleteProfilePic: ProfileController.deleteProfilePic(),
        changeEmail: ProfileController.changeEmail(),
        confirmNewEmail: ProfileController.confirmNewEmail(),
        deactivateAccount: ProfileController.deactivateAccount(),
        deleteAccount: ProfileController.deleteAccount(),
        confirmDeletion: ProfileController.confirmDeletion(),
      },
    }),

    resolve: () => true,
  }
})()
