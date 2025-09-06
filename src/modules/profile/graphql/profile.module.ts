import profileController from "./profile.controller"
import { returnedType } from "../../../common/decorators/resolver/returned-type.decorator"

export const queryModule = (() => {
  return {
    type: returnedType({
      name: "profileQuery",
      fields: {
        getProfile: profileController.getProfile(),
        getFollowers: profileController.getFollowers(),
        getFollowing: profileController.getFollowing(),
        getAllSavedPosts: profileController.getAllSavedPosts(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: "profileMutation",
      fields: {
        updateProfile: profileController.updateProfile(),
        changeVisibility: profileController.changeVisibility(),
        deleteProfilePic: profileController.deleteProfilePic(),
        changeEmail: profileController.changeEmail(),
        confirmNewEmail: profileController.confirmNewEmail(),
        deactivateAccount: profileController.deactivateAccount(),
        deleteAccount: profileController.deleteAccount(),
        confirmDeletion: profileController.confirmDeletion(),
      },
    }),
    resolve: () => true,
  }
})()
