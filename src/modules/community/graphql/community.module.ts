import { returnedType } from "../../../common/decorators/resolver/returned-type.decorator"
import communityController from "./community.controller"

export const queryModule = (() => {
  return {
    type: returnedType({
      name: "communityQuery",
      fields: {
        getCommunity: communityController.getCommunity(),
        getAllCommunities: communityController.getAllCommunities(),
        getCommunityMembers: communityController.getCommunityMembers(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: "communityMutation",
      fields: {
        create: communityController.create(),
        edit: communityController.edit(),
        addAdmin: communityController.addAdmin(),
        removeAdmin: communityController.removeAdmin(),
        changeVisibility: communityController.changeVisibility(),
        deleteCommunity: communityController.deleteCommunity(),
        removePostFromCommunity: communityController.removePostFromCommunity(),
        join: communityController.join(),
        leave: communityController.leave(),
        acceptJoinRequest: communityController.acceptJoinRequest(),
        rejectJoinRequest: communityController.rejectJoinRequest(),
        kickOut: communityController.kickOut(),
      },
    }),
    resolve: () => true,
  }
})()
