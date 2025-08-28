import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { CommunityController } from './community.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'communityQuery',
      fields: {
        getCommunity: CommunityController.getCommunity(),
        getAllCommunities: CommunityController.getAllCommunities(),
        getCommunityMembers: CommunityController.getCommunityMembers(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: 'communityMutation',
      fields: {
        create: CommunityController.create(),
        edit: CommunityController.edit(),
        addAdmin: CommunityController.addAdmin(),
        removeAdmin: CommunityController.removeAdmin(),
        changeVisibility: CommunityController.changeVisibility(),
        deleteCommunity: CommunityController.deleteCommunity(),
        removePostFromCommunity: CommunityController.removePostFromCommunity(),
        join: CommunityController.join(),
        leave: CommunityController.leave(),
        acceptJoinRequest: CommunityController.acceptJoinRequest(),
        rejectJoinRequest: CommunityController.rejectJoinRequest(),
        kickOut: CommunityController.kickOut(),
      },
    }),
    resolve: () => true,
  }
})()
