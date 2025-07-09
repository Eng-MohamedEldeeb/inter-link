import { ProfileController } from './profile.controller'
import { returnedType } from '../../../common/decorators/graphql/returned-type.decorator'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'profileQuery',
      fields: {
        getProfile: ProfileController.getProfile(),
        getFollowers: ProfileController.getFollowers(),
        getFollowing: ProfileController.getFollowing(),
        getAllSavedPosts: ProfileController.getAllSavedPosts(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
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
